import useSWR, { SWRConfiguration } from 'swr'

import contract from '../contract'

export default (config: SWRConfiguration | undefined = undefined) => useSWR('publicMintPrice', async (): Promise<bigint> => {
    return contract.publicMintPrice()
}, config)