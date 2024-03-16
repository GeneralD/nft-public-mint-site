import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'

import { AppBar, Toolbar, Typography } from '@mui/material'

import useWindowSize from '../hooks/useWindowSize'
import AppMenu from './AppMenu'
import Banner from './Banner'
import ConnectWalletButton from './common/ConnectWalletButton'

export default () => {
    const { isMobile } = useWindowSize()
    const title = isMobile ? process.env.REACT_APP_SHORT_TITLE : process.env.REACT_APP_TITLE

    return <>
        <Helmet title={process.env.REACT_APP_TITLE} />
        <Helmet style={[{ cssText: 'body { margin: 0; }' }]} />
        <AppBar position="static">
            <Toolbar
                variant='dense'>
                <AppMenu />
                <Typography
                    variant='h6'
                    color='inherit'
                    component='span'
                    sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <ConnectWalletButton
                    sx={{ marginX: '4px' }}
                    variant='outlined'
                    color='inherit' />
            </Toolbar>
        </AppBar>
        <Banner />
        <Outlet />
    </>
}