import { BrowserProvider, Contract, Eip1193Provider, Interface, WebSocketProvider } from 'ethers'

import IERC721 from './abi/IERC721.json'
import IPublicMintable from './abi/IPublicMintable.json'

export const getContract = ({
    as,
}: {
    as: 'erc721' | 'publicMintable'
}) => {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    const rpcUrl = process.env.REACT_APP_RPC_WS_URL
    if (!contractAddress || !rpcUrl) return undefined
    const provider = new WebSocketProvider(rpcUrl)
    const ifc = as === 'erc721' ? new Interface(IERC721.abi) : new Interface(IPublicMintable.abi)
    return new Contract(contractAddress, ifc, provider)
}