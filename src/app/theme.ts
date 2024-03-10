import { createTheme } from '@mui/material'

const lighter = (color: string, rate: number) => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `#${Math.floor(r * rate).toString(16)}${Math.floor(g * rate).toString(16)}${Math.floor(b * rate).toString(16)}`
}

const darker = (color: string, rate: number) => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `#${Math.floor(r / rate).toString(16)}${Math.floor(g / rate).toString(16)}${Math.floor(b / rate).toString(16)}`
}

const contrastText = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness >= 128 ? '#000000' : '#ffffff'
}

const primaryColor = process.env.REACT_APP_MUI_THEME_PRIMARY_COLOR || '#42a5f5'
const secondaryColor = process.env.REACT_APP_MUI_THEME_SECONDARY_COLOR || '#f06292'

export default createTheme({
    palette: {
        primary: {
            main: primaryColor,
            light: lighter(primaryColor, 1.5),
            dark: darker(primaryColor, 1.5),
            contrastText: contrastText(primaryColor),
        },
        secondary: {
            main: secondaryColor,
            light: lighter(secondaryColor, 1.5),
            dark: darker(secondaryColor, 1.5),
            contrastText: contrastText(secondaryColor),
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                sx: {
                    margin: '16px',
                }
            }
        },
        MuiCard: {
            defaultProps: {
                sx: {
                    margin: '32px',
                    padding: '16px',
                    borderRadius: '32px',
                    backgroundColor: '#fcfcfc',
                    boxShadow: '14px 14px 28px #bebebe, -14px -14px 28px #ffffff'
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                sx: {
                    margin: '16px'
                }
            }
        },
    }
})