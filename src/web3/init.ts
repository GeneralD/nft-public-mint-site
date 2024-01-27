import injectedModule from '@web3-onboard/injected-wallets'
import { init } from '@web3-onboard/react'

init({
    wallets: [injectedModule()],
    chains: [{
        id: process.env.REACT_APP_CHAIN_ID ?? '0x1',
        token: process.env.REACT_APP_CHAIN_TOKEN ?? 'ETH',
        label: process.env.REACT_APP_CHAIN_LABEL ?? 'Mainnet',
        rpcUrl: process.env.REACT_APP_RPC_URL ?? '',
    }]
})