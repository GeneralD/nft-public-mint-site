import { ContractEventPayload, formatEther, TransactionRequest, ZeroAddress } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { Button, Card, TextField, Typography } from '@mui/material'

import useWeb3, { useEvent } from '../web3/useWeb3'

export default () => {
    const { t } = useTranslation()
    const { account, isActive, contract, sendTransaction, } = useWeb3()
    const { data: price, mutate: mutatePrice, } = useSWR('publicMintPrice', (): Promise<bigint> => contract.publicMintPrice())
    const { data: symbol } = useSWR('publicMintSymbol', (): Promise<string> => contract.symbol())

    const [state, setState] = useState<{
        amount?: bigint,
    }>({
        amount: 1n,
    })

    useEvent(contract.filters.PublicMintPriceChanged, (price: bigint) => mutatePrice(price), [mutatePrice])

    const userMinted = contract.filters.Transfer(ZeroAddress, account, null)
    useEvent(userMinted, (payload: ContractEventPayload) => {
        const tokenId = payload.args.tokenId
        console.info(`Minted: ${tokenId}`)
        // TODO: display UI
    })

    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()

        const amount = state.amount
        const isReady = !!sendTransaction && !!amount && !!price
        if (!isReady) return

        try {
            const tx: TransactionRequest = await contract.publicMint(state.amount, { value: price * amount })
            const response = await sendTransaction(tx)
            console.info(`Transaction hash: ${response?.hash}`)
        } catch (error) {
            console.error(error)
        }
    }, [contract, sendTransaction, state.amount, price])

    const max = (...args: bigint[]) => args.reduce((a, b) => a > b ? a : b, 0n)

    return <>
        <Card>
            <form
                onSubmit={handleMint}
                autoComplete='off'>
                {!!price && <>
                    <Typography variant='h6'>
                        {t('publicMint.priceLabel', { value: formatEther(price), valueSymbol: 'ETH', nftSymbol: symbol })}
                    </Typography>
                </>}
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
        </Card>
    </>
}