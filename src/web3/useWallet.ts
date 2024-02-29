import { id, Wallet } from 'ethers'
import { useEffect, useState } from 'react'

import { useWeb3React } from '@web3-react/core'

import provider from './provider'

export default () => {
    const { account } = useWeb3React()
    const [wallet, setWallet] = useState<Wallet | null>(null)
    useEffect(() => {
        setWallet(account ? new Wallet(id(account), provider) : null)
    }, [account])
    return wallet
}