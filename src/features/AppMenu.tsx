import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BarChart, Language, Sailing } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'

import LanguageSelect from './common/LanguageSelect'

export default () => {
    const { t } = useTranslation()
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>()

    const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget)
    }, [])

    const closeMenu = useCallback(() => {
        setMenuAnchor(undefined)
    }, [])

    const openInOpensea = useCallback(() => {
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || ''
        window.open(`https://opensea.io/assets/ethereum/${contractAddress}`, '_blank')
        closeMenu()
    }, [closeMenu])

    const openInEtherscan = useCallback(() => {
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || ''
        window.open(`https://etherscan.io/address/${contractAddress}`, '_blank')
        closeMenu()
    }, [closeMenu])
    return <>
        <IconButton
            size='small'
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={openMenu}>
            <MenuIcon />
        </IconButton>
        <Menu
            id="basic-menu"
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={closeMenu}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem
                onClick={openInOpensea}>
                <Sailing />
                <Typography
                    sx={{ marginX: '8px' }}>
                    {t('menu.openInOpensea.label')}
                </Typography>
            </MenuItem>
            <MenuItem
                onClick={openInEtherscan}>
                <BarChart />
                <Typography
                    sx={{ marginX: '8px' }}>
                    {t('menu.openInEtherscan.label')}
                </Typography>
            </MenuItem>
            <MenuItem>
                <Language />
                <Typography
                    sx={{ marginX: '8px' }}>
                    {t('menu.languageSelection.label')}
                </Typography>
                <LanguageSelect
                    variant='outlined'
                    size='small' />
            </MenuItem>
        </Menu>
    </>
}