import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from 'use-toast-mui'

import {
    Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Typography
} from '@mui/material'

import useWindowSize from '../../hooks/useWindowSize'
import { hooks, metaMask } from '../../web3/connectors/metaMask'
import parseTransactionError from '../../web3/utils/parseTransactionError'

export default (props: ButtonProps) => {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || '1')

    const { isMobile } = useWindowSize()
    const toast = useToast()
    const { t } = useTranslation()
    const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)

    const { useAccount, useIsActivating, useIsActive } = hooks
    const account = useAccount()
    const isActivating = useIsActivating()
    const isActive = useIsActive()

    useEffect(() => {
        metaMask.connectEagerly()
    }, [])

    const handleClick = useCallback(async () => {
        if (isActive) {
            setDisconnectDialogOpen(true)
        } else {
            try {
                await metaMask.activate(chainId)
                toast.success(t('connectWallet.walletConnectedMessage'))
            } catch (error) {
                const err = await parseTransactionError(error)
                toast.show(t(err.localizationKey, err.localizationParams), { severity: err.severity })
            }
        }
    }, [isActive, t])

    const handleCloseDialog = useCallback(() => {
        setDisconnectDialogOpen(false)
    }, [])

    const handleDisconnect = useCallback(async () => {
        handleCloseDialog()
        if (metaMask.deactivate) {
            await metaMask.deactivate()
        } else {
            metaMask.resetState()
        }
    }, [metaMask])

    const shrinkedAddress = `${account?.slice(0, 6)}...${account?.slice(-4)}`
    const label = isActive
        ? shrinkedAddress :
        isMobile ? t('connectWallet.connectButton.shortLabel') : t('connectWallet.connectButton.label')

    return <>
        <Button
            {...props}
            onClick={handleClick}
            disabled={isActivating}>
            <Typography variant='button' sx={{ fontWeight: 'bold' }}>
                {label}
            </Typography>
        </Button>

        <Dialog
            open={disconnectDialogOpen}
            onClose={handleCloseDialog}
            keepMounted>
            <DialogTitle>
                {t('connectWallet.disconnectDialog.title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('connectWallet.disconnectDialog.content')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>
                    {t('connectWallet.disconnectDialog.cancel')}
                </Button>
                <Button onClick={handleDisconnect}>
                    {t('connectWallet.disconnectDialog.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    </>
}