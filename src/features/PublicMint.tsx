import { formatEther, id, Wallet } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, TextField, Typography } from '@mui/material'
import { useWeb3React } from '@web3-react/core'

import contract from '../web3/contract'
import usePublicMintPrice from '../web3/swr/usePublicMintPrice'

export default () => {
    const { t } = useTranslation()
    const { account, isActive } = useWeb3React()
    const { data: price } = usePublicMintPrice()

    const [state, setState] = useState<{
        amount?: bigint,
    }>({
        amount: 1n,
    })

    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()

        const amount = state.amount
        const isReady = !!account && !!amount && !!price
        if (!isReady) return

        const totalPrice = price * amount
        try {
            const tx = await contract.publicMint(state.amount, { value: totalPrice })
            // await tx.wait()
            // await new Wallet(id(account)).signTransaction(tx)
        } catch (error) {
            console.error(error)
        }
    }, [account, state.amount])

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
                    disabled={!isActive}>
                    {t('publicMint.mintButton.label')}
                </Button>
            </form >
        </Card>
    </>
}