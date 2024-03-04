import { Contract, Signer, WebSocketProvider } from 'ethers'
import { useEffect, useState } from 'react'

import { useWeb3React } from '@web3-react/core'

import IEC721Metadata from './abi/IEC721Metadata.json'
import IERC721 from './abi/IERC721.json'
import IPublicMintable from './abi/IPublicMintable.json'

// Provider
const rpcUrl = process.env.REACT_APP_RPC_WS_URL || ''
const provider = new WebSocketProvider(rpcUrl)

// Signer: Automatically updates the signer when the account changes.
const useSigner = () => {
    const { account } = useWeb3React()
    const [signer, setSigner] = useState<Signer | undefined>()
    useEffect(() => {
        (async () => setSigner(account ? await provider.getSigner(account) : undefined))()
    }, [account])
    return signer
}

// Contract: Automatically updates the runner when the signer changes.
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || ''
const useContract = () => {
    const abi = [...IERC721.abi, ...IEC721Metadata.abi, ...IPublicMintable.abi]
    const unsigned = new Contract(contractAddress, abi, provider)
    const [contract, setContract] = useState<Contract>(unsigned)
    const signer = useSigner()
    useEffect(() => setContract(new Contract(contractAddress, abi, signer)), [signer])
    return contract
}

export default () => {
    const { account } = useWeb3React()
    const signer = useSigner()
    const contract = useContract()
    return { account, isActive: !!account, signer, contract }
}