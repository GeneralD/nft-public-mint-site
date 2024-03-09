import { ContractEventPayload, formatEther, TransactionRequest, ZeroAddress } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, Skeleton, TextField, Typography } from '@mui/material'

import usePublicMintPrice from '../web3/swr/usePublicMintPrice'
import useSymbol from '../web3/swr/useSymbol'
import useWeb3, { useEvent } from '../web3/useWeb3'
import Mount from './common/Mount'

export default () => {
    const { t } = useTranslation()
    const { account, isActive, contract, sendTransaction, } = useWeb3()

    const priceResponse = usePublicMintPrice({
        revalidateOnFocus: false,
    })

    const { data: symbol } = useSymbol({
        revalidateOnMount: true,
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const [state, setState] = useState<{
        amount?: bigint,
    }>({
        amount: 1n,
    })

    const userMinted = contract.filters.Transfer(ZeroAddress, account, null)
    useEvent(userMinted, (payload: ContractEventPayload) => {
        const tokenId = payload.args.tokenId
        console.info(`Minted: ${tokenId}`)
        // TODO: display UI
    })

    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()

        const amount = state.amount
        const price = priceResponse.data
        const isReady = !!sendTransaction && !!amount && !!price
        if (!isReady) return

        try {
            const tx: TransactionRequest = await contract.publicMint(state.amount, { value: price * amount })
            const response = await sendTransaction(tx)
            console.info(`Transaction hash: ${response?.hash}`)
        } catch (error) {
            console.error(error)
        }
    }, [contract, sendTransaction, state.amount, priceResponse.data])

    const max = (...args: bigint[]) => args.reduce((a, b) => a > b ? a : b, 0n)

    return <>
        <Card>
            <form
                onSubmit={handleMint}
                autoComplete='off'>
                <Mount
                    response={priceResponse}
                    loading={() =>
                        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
                    }
                    success={price =>
                        <Typography variant='h6'>
                            {t('publicMint.priceLabel', { value: formatEther(price), valueSymbol: 'ETH', nftSymbol: symbol })}
                        </Typography>}
                />
                <TextField
                    label={t('publicMint.amountInput.label')}
                    type='number'
                    variant='standard'
                    color='primary'
                    size='small'
                    required
                    value={state.amount?.toString() || ''}
                    onChange={e => {
                        setState(produce(draft => {
                            draft.amount = e.target.value.length === 0
                                ? undefined
                                : max(1n, BigInt(e.target.value))
                        }))
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }} />
                <Button
                    color='inherit'
                    variant='contained'
                    type='submit'
                    disabled={!isActive}>
                    {t('publicMint.mintButton.label')}
                </Button>
            </form >
        </Card >
    </>
}