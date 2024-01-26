import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'

import useWindowSize from '../hooks/useWindowSize'
import ConnectWalletButton from './common/ConnectWalletButton'

export default () => {
    const { isMobile } = useWindowSize()
    const title = isMobile ? process.env.REACT_APP_SHORT_TITLE : process.env.REACT_APP_TITLE

    return <>
        <Helmet title={process.env.REACT_APP_TITLE} />
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'>
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant='h6'
                        color='inherit'
                        component='span'
                        sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <ConnectWalletButton
                        variant='outlined'
                        color='inherit' />
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    </>
}