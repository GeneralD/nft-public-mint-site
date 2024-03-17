import type { AddEthereumChainParameter } from '@web3-react/types'

export default (chainId: number): AddEthereumChainParameter => {
    const chainName = (chainId: number): string => {
        switch (chainId) {
            case 1:
                return 'Mainnet'
            case 3:
                return 'Ropsten'
            case 4:
                return 'Rinkeby'
            case 5:
                return 'Goerli'
            case 42:
                return 'Kovan'
            case 11155111:
                return 'sepolia'
            default:
                return `Chain ID: ${chainId}`
        }
    }

    return {
        chainId,
        chainName: chainName(chainId),
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: [process.env.REACT_APP_RPC_URL || ''],
    }
}