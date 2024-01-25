import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'

export default () => {
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
                    <Typography variant='h6' component='div'>
                        {process.env.REACT_APP_TITLE}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    </>
}