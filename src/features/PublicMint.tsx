import { id, Wallet } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, TextField } from '@mui/material'
import { useWeb3React } from '@web3-react/core'

import { getContract } from '../web3/contract'

export default () => {
    const { t } = useTranslation()
    const { account, isActive } = useWeb3React()

    const [state, setState] = useState<{
        amount?: number,
    }>({
        amount: 1,
    })

    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()
        if (!account) return
        if (!state.amount) return

        const contract = getContract({ as: 'publicMintable' })
        try {
            const tx = await contract?.publicMint(state.amount)
            // await tx.wait()
            await new Wallet(id(account)).signTransaction(tx)
        } catch (error) {
            console.error(error)
        }
    }, [account, state.amount])

    return <>
        <Card>
            <form
                onSubmit={handleMint}
                autoComplete='off'>
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
                                : Math.max(1, Number(e.target.value))
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