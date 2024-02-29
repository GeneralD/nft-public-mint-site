import { Contract, WebSocketProvider } from 'ethers'

import IERC721 from './abi/IERC721.json'
import IPublicMintable from './abi/IPublicMintable.json'

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || ''
const rpcUrl = process.env.REACT_APP_RPC_WS_URL || ''
const provider = new WebSocketProvider(rpcUrl)
export default new Contract(contractAddress, [...IERC721.abi, ...IPublicMintable.abi], provider)