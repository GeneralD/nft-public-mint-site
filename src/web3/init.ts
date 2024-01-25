import injectedModule from '@web3-onboard/injected-wallets'
import { init } from '@web3-onboard/react'

init({
    wallets: [injectedModule()],
    chains: [{
        id: '0x1',
        token: 'ETH',
        label: 'Mainnet',
        rpcUrl: process.env.REACT_APP_MAINNET_WEB_SOCKET_RPC_URL
    }, {
        id: '0x5',
        token: 'ETH',
        label: 'Goerli',
        rpcUrl: process.env.REACT_APP_GOERLI_WEB_SOCKET_RPC_URL
    }]
})