import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask'

const connectors: [MetaMask, Web3ReactHooks][] = [
    [metaMask, metaMaskHooks],
]

export default () => {
    return <>
        <Web3ReactProvider connectors={connectors}>
            {null}
        </Web3ReactProvider>
    </>
}