import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from 'use-toast-mui'

import {
    Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Typography
} from '@mui/material'

import useWindowSize from '../../hooks/useWindowSize'
import addEthereumChainParameter from '../../web3/addEthereumChainParameter'
import { hooks, metaMask } from '../../web3/connectors/metaMask'
import parseTransactionError from '../../web3/parseTransactionError'

export default (props: ButtonProps) => {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || '1')

    const { isMobile } = useWindowSize()
    const toast = useToast()
    const { t } = useTranslation()
    const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)

    const { useAccounts, useIsActivating, useIsActive } = hooks
    const accounts = useAccounts()
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
                await metaMask.activate(addEthereumChainParameter(chainId))
            } catch (error) {
                const err = await parseTransactionError(error)
                toast.error(t(err.localizationKey, err.localizationParams))
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

    const shrinkedAddress = `${accounts?.[0]?.slice(0, 6)}...${accounts?.[0]?.slice(-4)}`
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