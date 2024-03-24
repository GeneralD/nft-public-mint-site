import { ContractEventName, Listener } from 'ethers'
import { useEffect } from 'react'

import contract from '../contract'

export const useEvent = (event: ContractEventName, listener: Listener) => useEffect(() => {
    contract.addListener(event, listener)
    // if remove the listener, new listener won't work well. maybe it's a bug of ethers.js.
    // return () => { unsignedContract.removeListener(event, listener) }
}, []) // if add some dependencies, it will be triggered so many times.