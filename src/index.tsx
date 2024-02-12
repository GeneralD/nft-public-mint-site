import './index.scss'
import './i18n/config'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { ScopedCssBaseline, ThemeProvider } from '@mui/material'

import router from './app/router'
import theme from './app/theme'
import Web3Provider from './web3/Web3Provider'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <StrictMode>
    <HelmetProvider>
      <ScopedCssBaseline>
        <ThemeProvider theme={theme}>
          <Web3Provider>
            <RouterProvider router={router} />
          </Web3Provider>
        </ThemeProvider>
      </ScopedCssBaseline>
    </HelmetProvider>
  </StrictMode>
)