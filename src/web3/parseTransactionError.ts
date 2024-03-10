import { ErrorDecoder, ErrorType } from 'ethers-decode-error'

import abi from './abi/abi'

enum ErrorLevel {
    User,
    Provider,
    Contract,
}

type TxError = {
    level: ErrorLevel
    localizationKey: string
    localizationParams?: Record<string, string>
}

export default async (error: any): Promise<TxError> => {
    return userError(error) || providerError(error.error) || await contractError(error)
}

const userError = (error: any): TxError | undefined => {
    const localizationKey = userErrorLocalizationKey(error)
    return localizationKey ? { level: ErrorLevel.User, localizationKey } : undefined
}

const userErrorLocalizationKey = (error: any): string | undefined => {
    const code = error?.code
    switch (code) {
        case 4001:
            return 'tx.error.theRequestWasRejectedByTheUser'
        case 4100:
            return 'tx.error.theRequestWasNotAuthorizedByTheUser'
        case 4200:
            return 'tx.error.theRequestNotSupportedByTheProvider'
        case 4900:
            return 'tx.error.theProviderIsDisconnectedFromAllChains'
        case 4901:
            return 'tx.error.theProviderIsDisconnectedFromTheRequestedChain'
        case 'UNKNOWN_ERROR':
        default:
            return undefined
    }
}

const providerError = (error: any): TxError | undefined => {
    const localizationKey = providerErrorLocalizationKey(error)
    return localizationKey ? { level: ErrorLevel.Provider, localizationKey } : undefined
}

const providerErrorLocalizationKey = (error: any): string | undefined => {
    const code = error?.code
    const message: string = error?.message || ''

    switch (code) {
        case -32001:
            return 'tx.error.walletNotAuthorized'
        case -32002:
            return 'tx.error.walletNotReady'
        case -32003:
            return 'tx.error.walletNotSupported'
        case -32004:
            return 'tx.error.walletNotAvailable'
        case -32603:
            return 'tx.error.insufficientFunds'
        case -32000:
            if (message.startsWith("sender doesn't have enough funds to send tx.")) {
                return 'tx.error.insufficientFunds'
            }
            return undefined
        default:
            return undefined
    }
}

const contractError = async (error: any): Promise<TxError> => {
    const decoder = ErrorDecoder.create([abi])
    const ethError = await decoder.decode(error)

    switch (ethError.type) {
        case ErrorType.EmptyError:
            return {
                level: ErrorLevel.Contract,
                localizationKey: 'tx.error.contractEmptyError',
                localizationParams: {},
            }
        case ErrorType.RevertError:
            // return 'tx.error.revertError'
            return {
                level: ErrorLevel.Contract,
                localizationKey: 'tx.error.contractRevertError',
                localizationParams: {
                    errorName: ethError.name,
                },
            }
        case ErrorType.PanicError:
            return {
                level: ErrorLevel.Contract,
                localizationKey: 'tx.error.contractPanicError',
                localizationParams: {
                    errorName: ethError.name,
                },
            }
        case ErrorType.CustomError:
            return {
                level: ErrorLevel.Contract,
                localizationKey: 'tx.error.contractCustomError',
                localizationParams: {
                    errorName: ethError.name,
                },
            }
        case ErrorType.UserRejectError:
            return {
                level: ErrorLevel.Contract,
                localizationKey: 'tx.error.contractUserRejectError',
            }
        case ErrorType.RpcError:
            return {
                level: ErrorLevel.Contract,
                localizationKey: 'tx.error.contractRpcError',
            }
        case ErrorType.UnknownError:
        default:
            return {
                level: ErrorLevel.Contract,
                localizationKey: 'tx.error.contractUnknownError',
            }
    }
}