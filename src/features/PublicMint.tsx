import { formatEther } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { Button, Card, TextField, Typography } from '@mui/material'

import useContract from '../web3/useContract'
import useWallet from '../web3/useWallet'

export default () => {
    const { t } = useTranslation()
    const wallet = useWallet()
    const contract = useContract()
    const { data: price } = useSWR('publicMintPrice', async (): Promise<bigint> => await contract.publicMintPrice())

    const [state, setState] = useState<{
        amount?: bigint,
    }>({
        amount: 1n,
    })

    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()

        const amount = state.amount
        const isReady = !!wallet && !!amount && !!price
        if (!isReady) return

        try {
            const nonce = await wallet?.getNonce()
            const tx = await contract.publicMint(state.amount, { value: price * amount, nonce, })
            // await wallet.signTransaction(tx)
            // await tx.wait()
        } catch (error) {
            console.error(error)
        }
    }, [contract, price, state.amount, wallet])

    const max = (...args: bigint[]) => args.reduce((a, b) => a > b ? a : b, 0n)

    return <>
        <Card>
            <form
                onSubmit={handleMint}
                autoComplete='off'>
                {!!price && <>
                    <Typography variant='h6'>
                        {t('publicMint.priceLabel', { value: formatEther(price), valueSymbol: 'ETH', tokenSymbol: 'NFT' })}
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
                    disabled={!wallet}>
                    {t('publicMint.mintButton.label')}
                </Button>
            </form >
        </Card>
    </>
}