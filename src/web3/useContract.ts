import { Contract } from 'ethers'
import { useEffect, useState } from 'react'

import IERC721 from './abi/IERC721.json'
import IPublicMintable from './abi/IPublicMintable.json'
import provider from './provider'
import useWallet from './useWallet'

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || ''

export default () => {
    const abi = [...IERC721.abi, ...IPublicMintable.abi]
    const wallet = useWallet()
    const unsigned = new Contract(contractAddress, abi, provider)
    const [contract, setContract] = useState<Contract>(unsigned)
    useEffect(() => setContract(wallet ? new Contract(contractAddress, abi, wallet) : unsigned), [wallet])
    return contract
}