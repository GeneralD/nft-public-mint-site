import './index.scss'
import './i18n/config'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { ScopedCssBaseline, ThemeProvider } from '@mui/material'
import { Web3OnboardProvider } from '@web3-onboard/react'

import router from './app/router'
import theme from './app/theme'
import onboard from './web3/onboard'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <StrictMode>
    <HelmetProvider>
      <Web3OnboardProvider web3Onboard={onboard}>
        <ScopedCssBaseline>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </ScopedCssBaseline>
      </Web3OnboardProvider>
    </HelmetProvider>
  </StrictMode>
)