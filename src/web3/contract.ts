import { Contract } from 'ethers'

import abi from './abi/abi'
import provider from './provider'

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || ''

export default new Contract(contractAddress, abi, provider)
