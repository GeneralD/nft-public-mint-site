import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { useEffect, useState } from 'react'

import { useWeb3React } from '@web3-react/core'

const useBrowserProvider = () => {
    const [browserProvider, setBrowserProvider] = useState<BrowserProvider>()
    useEffect(() => {
        if (!window.ethereum) return setBrowserProvider(undefined)
        return setBrowserProvider(new BrowserProvider(window.ethereum as any))
    }, [window.ethereum])
    return browserProvider
}

export default () => {
    const { account } = useWeb3React()
    const browserProvider = useBrowserProvider()
    const [browserSigner, setBrowserSigner] = useState<JsonRpcSigner>()
    useEffect(() => {
        (async () => {
            if (!browserProvider || !account) return setBrowserSigner(undefined)
            return setBrowserSigner(await browserProvider.getSigner(account))
        })()
    }, [browserProvider, account])
    return browserSigner
}
