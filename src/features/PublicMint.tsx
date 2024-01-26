import { produce } from 'immer'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, TextField } from '@mui/material'
import { useWallets } from '@web3-onboard/react'

export default () => {
    const { t } = useTranslation()

    const connectedWallets = useWallets()

    const [state, setState] = useState<{
        amount?: number,
    }>({
        amount: 1,
    })

    const handleMint = useCallback(async () => {
        if (!connectedWallets.length) return
        // TODO
    }, [connectedWallets])

    return <>
        <TextField
            label={t('publicMint.amountInput.label')}
            type='number'
            color='primary'
            size='small'
            value={state.amount?.toString() || ''}
            onChange={e => {
                setState(produce(draft => {
                    draft.amount = e.target.value.length === 0
                        ? undefined
                        : Math.max(1, Number(e.target.value))
                }))
            }}
        />
        <Button
            color='inherit'
            variant='contained'
            onClick={handleMint}>
            {t('publicMint.mintButton.label')}
        </Button>
    </>
}