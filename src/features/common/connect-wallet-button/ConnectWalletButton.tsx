import { Button, ButtonProps, Typography } from '@mui/material'

export default (props: ButtonProps) => {
    return <>
        <Button
            {...props}>
            <Typography variant='button'>
                Connect Wallet
            </Typography>
        </Button>
    </>
}