import {
    Contract, ContractEventName, Listener, Signer, TransactionRequest, TransactionResponse,
    WebSocketProvider
} from 'ethers'
import { useEffect, useState } from 'react'

import { useWeb3React } from '@web3-react/core'

import abi from './abi/abi'

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
    const unsigned = new Contract(contractAddress, abi, provider)
    const [contract, setContract] = useState<Contract>(unsigned)
    const signer = useSigner()
    useEffect(() => setContract(new Contract(contractAddress, abi, signer)), [signer])
    return contract
}

// SendTransaction: Automatically updates the sendTransaction when the signer changes.
const useSendTransaction = () => {
    const signer = useSigner()
    const [sendTransaction, setSendTransaction] = useState<(tx: TransactionRequest) => Promise<TransactionResponse>>()
    useEffect(() => {
        if (!signer) return setSendTransaction(undefined)

        setSendTransaction(() => async (tx: TransactionRequest) => {
            // MEMO: on localhost, this function will execute actual transactions. so it will be triggered twice.
            const populatedTx = await signer.populateTransaction(tx)
            // to avoid the "Cannot send both gasPrice and maxFeePerGas param" error
            delete populatedTx.maxFeePerGas
            delete populatedTx.maxPriorityFeePerGas
            // configured nonce has already been used...
            populatedTx.nonce = await signer.getNonce()

            // send the transaction
            // MEMO: on localhost, the transaction will be executed without confirmation.
            const response = await signer.sendTransaction(populatedTx)
            console.info(`Transaction hash: ${response.hash}`)
            return response
        })
    }, [signer])

    return sendTransaction
}

export default () => {
    const { account } = useWeb3React()
    const signer = useSigner()
    const contract = useContract()
    const sendTransaction = useSendTransaction()
    return { account, isActive: !!account, signer, contract, sendTransaction, }
}

// Event subscription
const unsignedContract = new Contract(contractAddress, abi, provider)
export const useEvent = (event: ContractEventName, listener: Listener) =>
    useEffect(() => {
        unsignedContract.addListener(event, listener)
        // if remove the listener, new listener won't work well. maybe it's a bug of ethers.js.
        // return () => { unsignedContract.removeListener(event, listener) }
    }, []) // if add some dependencies, it will be triggered so many times.
