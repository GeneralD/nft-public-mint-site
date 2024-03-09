import { ContractEventPayload } from 'ethers'
import useSWR, { SWRConfiguration } from 'swr'

import useWeb3, { useEvent } from '../useWeb3'

export default (config?: SWRConfiguration) => {
    const { contract } = useWeb3()
    const response = useSWR('publicMintPrice', (): Promise<bigint> => contract.publicMintPrice(), config)
    const { mutate } = response
    useEvent(contract.filters.PublicMintPriceChanged(null), (payload: ContractEventPayload) => mutate(payload.args.price), [mutate])
    return response
}