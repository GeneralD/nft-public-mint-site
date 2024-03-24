import { WebSocketProvider } from 'ethers'

const rpcUrl = process.env.REACT_APP_RPC_WS_URL || ''
export default new WebSocketProvider(rpcUrl)
