import './index.scss'
import './i18n/config'
import './web3/init'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { ScopedCssBaseline, ThemeProvider } from '@mui/material'

import router from './app/router'
import theme from './app/theme'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <StrictMode>
    <HelmetProvider>
      <ScopedCssBaseline>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ScopedCssBaseline>
    </HelmetProvider>
  </StrictMode>
)