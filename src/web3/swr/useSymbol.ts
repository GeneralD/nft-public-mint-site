import useSWR, { SWRConfiguration } from 'swr'

import useWeb3 from '../useWeb3'

export default (config?: SWRConfiguration) => {
    const { contract } = useWeb3()
    return useSWR('symbol', (): Promise<string> => contract.symbol(), config)
}