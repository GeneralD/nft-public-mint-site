import { createTheme } from '@mui/material'

export default createTheme({
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