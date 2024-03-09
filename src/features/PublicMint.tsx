import { ContractEventPayload, formatEther, TransactionRequest, ZeroAddress } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useRef, useState } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { TCanvasConfettiInstance } from 'react-canvas-confetti/dist/types'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { useToast } from 'use-toast-mui'

import { Button, Card, debounce, Skeleton, TextField, Typography } from '@mui/material'

import useWeb3, { useEvent } from '../web3/useWeb3'
import Mount from './common/Mount'

export default () => {
    const { t } = useTranslation()
    const { account, isActive, contract, sendTransaction, } = useWeb3()
    const toast = useToast()
    const confettiRef = useRef<TCanvasConfettiInstance>()

    const priceResponse = useSWR('publicMintPrice', (): Promise<bigint> => contract.publicMintPrice(), {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    })
    const { mutate: mutatePrice } = priceResponse
    const { data: symbol } = useSWR('symbol', (): Promise<string> => contract.symbol(), {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    })

    const [state, setState] = useState<{
        amount?: bigint,
        isPendingTx: boolean,
    }>({
        amount: 1n,
        isPendingTx: false,
    })

    useEvent(contract.filters.PublicMintPriceChanged, (price: bigint) => mutatePrice(price))

    useEvent(contract.filters.Transfer(ZeroAddress, account, null), useCallback(debounce((payload: ContractEventPayload) => {
        const tokenId = payload.args.tokenId
        toast.success(t('publicMint.toast.mintSuccess', { tokenId }))
        setState(produce(draft => { draft.isPendingTx = false }))
        confettiRef.current?.({
            particleCount: 300,
            spread: 70,
            angle: -60,
            origin: { x: 0, y: -0.3 },
        })
        confettiRef.current?.({
            particleCount: 300,
            spread: 70,
            angle: -120,
            origin: { x: 1, y: -0.3 },
        })
    }), [t, confettiRef]))

    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()

        const amount = state.amount
        const price = priceResponse.data
        const isReady = !!sendTransaction && !!amount && !!price
        if (!isReady) return

        try {
            setState(produce(draft => { draft.isPendingTx = true }))
            const tx: TransactionRequest = await contract.publicMint(state.amount, { value: price * amount })
            const response = await sendTransaction(tx)
            console.info(`Transaction hash: ${response?.hash}`)
        } catch (error: any) {
            setState(produce(draft => { draft.isPendingTx = false }))

            const message: string = error.message
            const code = error.code

            if (message.includes("User denied transaction signature") || message.includes("User rejected the transaction"))
                toast.warning(t('publicMint.toast.mintCanceled'))
            else if (message.includes("ethereum wallet is not installed"))
                toast.error(t('publicMint.toast.walletNotInstalled'))
            else if (code === -32002)
                toast.error(t('publicMint.toast.walletNotReady'))
            else
                toast.error(t('publicMint.toast.unknownError', { code }))
        }
    }, [contract, sendTransaction, state.amount, priceResponse.data, t])

    const onAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const max = (...args: bigint[]) => args.reduce((a, b) => a > b ? a : b, 0n)
        setState(produce(draft => {
            draft.amount = e.target.value.length === 0
                ? undefined
                : max(1n, BigInt(e.target.value))
        }))
    }, [])

    return <>
        <ReactCanvasConfetti onInit={({ confetti }) => { confettiRef.current = confetti }} />
        <Card>
            <form
                onSubmit={handleMint}
                autoComplete='off'>
                <Mount
                    response={priceResponse}
                    loading={() =>
                        <Skeleton variant="text" width={130} sx={{ fontSize: '1.25rem' }} />
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
                    onChange={onAmountChange}
                    InputLabelProps={{
                        shrink: true,
                    }} />
                <Button
                    color='inherit'
                    variant='contained'
                    type='submit'
                    disabled={!isActive || state.isPendingTx}>
                    {t('publicMint.mintButton.label')}
                </Button>
            </form >
        </Card >
    </>
}