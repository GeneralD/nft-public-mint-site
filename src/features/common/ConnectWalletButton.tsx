import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Typography
} from '@mui/material'
import { useConnectWallet } from '@web3-onboard/react'

export default (props: ButtonProps) => {
    const { t } = useTranslation()
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)

    const handleClick = useCallback(async () => {
        wallet ? setDisconnectDialogOpen(true) : await connect()
    }, [wallet, connect, disconnect])

    const handleDisconnect = useCallback(async () => {
        handleCloseDialog()
        if (wallet) await disconnect({ label: wallet.label })
    }, [disconnect, wallet])

    const handleCloseDialog = useCallback(() => {
        setDisconnectDialogOpen(false)
    }, [])

    const shrinkedAddress = wallet?.accounts[0]?.address.slice(0, 6) + '...' + wallet?.accounts[0]?.address.slice(-4)
    const label = wallet ? shrinkedAddress : t('connectWallet.connectButton.label')

    return <>
        <Button
            {...props}
            onClick={handleClick}
            disabled={connecting}>
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