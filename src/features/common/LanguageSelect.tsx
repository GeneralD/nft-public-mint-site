import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { MenuItem, Select, SelectProps } from '@mui/material'

export default (props: SelectProps) => {
    const { i18n } = useTranslation()
    return <>
        <Helmet htmlAttributes={{ lang: i18n.language }} />
        <Select
            {...props}
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value as string)}
        >
            <MenuItem value="en">🇺🇸</MenuItem>
            <MenuItem value="ja">🇯🇵</MenuItem>
        </Select>
    </>
}