import { SWRResponse } from 'swr'

export default <Data, Error>({
    response,
    idling,
    loading,
    success,
    failure,
    empty,
}: {
    response: SWRResponse<Data, Error>,
    idling?: () => JSX.Element | undefined,
    loading?: () => JSX.Element | undefined,
    success?: (data: Data) => JSX.Element | undefined,
    failure?: (error: Error) => JSX.Element | undefined,
    empty?: () => JSX.Element | undefined,
}) =>
    response.data
        ? isEmpty(response.data)
            ? empty?.() ?? success?.(response.data)
            : success?.(response.data) ?? empty?.()
        : response.error
            ? failure?.(response.error)
            : response.isLoading
                ? loading?.()
                : idling?.()

const isEmpty = (subject: any) => {
    if (Array.isArray(subject)) return subject.length === 0
    if (typeof subject === 'object') return Object.keys(subject).length === 0
    if (typeof subject === 'string') return subject.length === 0
    return false
}