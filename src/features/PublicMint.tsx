import { ContractEventPayload, formatEther, ZeroAddress } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useRef, useState } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { TCanvasConfettiInstance } from 'react-canvas-confetti/dist/types'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { useToast } from 'use-toast-mui'

import { Button, Card, debounce, Skeleton, TextField, Typography } from '@mui/material'
import { useWeb3React } from '@web3-react/core'

import contract from '../web3/contract'
import useBrowserSigner from '../web3/hooks/useBrowserSigner'
import { useEvent } from '../web3/hooks/useEvent'
import parseTransactionError from '../web3/utils/parseTransactionError'
import Mount from './common/Mount'
import PublicMintPeriod from './PublicMintPeriod'

export default () => {
    const { t } = useTranslation()
    const { account, isActive } = useWeb3React()
    const signer = useBrowserSigner()
    const toast = useToast()
    const confettiRef = useRef<TCanvasConfettiInstance>()

    const priceResponse = useSWR('publicMintPrice', (): Promise<bigint> => contract.publicMintPrice(), {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    })

    const { mutate: mutatePrice } = priceResponse
    useEvent(contract.filters.PublicMintPriceChanged, (price: bigint) => mutatePrice(price))

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

    const confetti = useCallback(() => {
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
    }, [confettiRef])

    useEvent(contract.filters.Transfer(ZeroAddress, account, null), useCallback(debounce((payload: ContractEventPayload) => {
        const tokenId = payload.args.tokenId
        toast.success(t('publicMint.toast.mintSuccess', { tokenId }))
        setState(produce(draft => { draft.isPendingTx = false }))
        confetti()
    }), [t, confetti]))

    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()

        const amount = state.amount
        const price = priceResponse.data
        const isReady = !!signer && !!amount && !!price
        if (!isReady) return

        try {
            setState(produce(draft => { draft.isPendingTx = true }))
            const tx = await contract.publicMint.populateTransaction(amount, { value: amount * price })
            const response = await signer.sendTransaction(tx)
            await response.wait()
            console.log("Transaction mined:", response.hash)
        } catch (error: any) {
            setState(produce(draft => { draft.isPendingTx = false }))
            const err = await parseTransactionError(error)
            toast.show(t(err.localizationKey, err.localizationParams), { severity: err.severity })
        }
    }, [state, signer, priceResponse, t])

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
        <Card sx={{
            margin: '24px',
            padding: '24px',
            borderRadius: '32px',
            backgroundColor: '#fcfcfc',
            boxShadow: '14px 14px 28px #bebebe, -14px -14px 28px #ffffff, inset 7px 7px 14px #bebebe, inset -7px -7px 14px #ffffff',
        }}>
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
            <PublicMintPeriod whenAvailable={() =>
                <form
                    onSubmit={handleMint}
                    autoComplete='off'>
                    <TextField
                        sx={{ margin: '16px 8px' }}
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
                        sx={{ margin: '16px 8px' }}
                        color='inherit'
                        variant='contained'
                        type='submit'
                        disabled={!isActive || state.isPendingTx}>
                        {t('publicMint.mintButton.label')}
                    </Button>
                </form>
            } />
        </Card>
    </>
}