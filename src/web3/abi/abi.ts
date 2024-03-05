import IEC721Metadata from './IEC721Metadata.json'
import IERC721 from './IERC721.json'
import IERC721Enumerable from './IERC721Enumerable.json'
import IPublicMintable from './IPublicMintable.json'

type ABI = {
    name: string,
    type: string,
    inputs?: { name: string, type: string }[],
    outputs?: { name: string, type: string }[],
    stateMutability?: string,
    payable?: boolean,
    anonymous?: boolean,
}

const abi: ABI[] = [...IERC721.abi, ...IERC721Enumerable.abi, ...IEC721Metadata.abi, ...IPublicMintable.abi]

export default abi
