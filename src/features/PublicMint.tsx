import { formatEther, TransactionRequest } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { Button, Card, TextField, Typography } from '@mui/material'

import useWeb3 from '../web3/useWeb3'

export default () => {
    const { t } = useTranslation()
    const { isActive, contract, signer } = useWeb3()
    const { data: price } = useSWR('publicMintPrice', (): Promise<bigint> => contract.publicMintPrice())
    const { data: symbol } = useSWR('publicMintSymbol', (): Promise<string> => contract.symbol())

    const [state, setState] = useState<{
        amount?: bigint,
    }>({
        amount: 1n,
    })

    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()

        const amount = state.amount
        const isReady = !!signer && !!amount && !!price
        if (!isReady) return

        try {
            const value = price * amount
            const tx: TransactionRequest = await contract.publicMint(state.amount, { value, })
            const populatedTx = await signer.populateTransaction(tx)
            const response = await signer.sendTransaction(populatedTx)
        } catch (error) {
            console.error(error)
        }
    }, [contract, price, signer, state.amount])

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