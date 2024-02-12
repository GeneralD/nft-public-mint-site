import { ReactNode } from 'react'

import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask'

const connectors: [MetaMask, Web3ReactHooks][] = [
    [metaMask, metaMaskHooks],
]

export default (props: {
    children: ReactNode
}) => {
    return <>
        <Web3ReactProvider connectors={connectors}>
            {props.children}
        </Web3ReactProvider>
    </>
}