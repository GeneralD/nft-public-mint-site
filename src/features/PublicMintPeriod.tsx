import { ContractEventPayload } from 'ethers'
import { produce } from 'immer'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { Skeleton, Typography } from '@mui/material'

import useWeb3, { useEvent } from '../web3/useWeb3'
import Mount from './common/Mount'

export default ({
    whenAvailable,
}: {
    whenAvailable: () => JSX.Element,
}) => {
    const { contract, } = useWeb3()
    const { t, i18n } = useTranslation()

    const mintStartDateResponse = useSWR('publicMintStartTimestamp', async () => {
        const timestamp: bigint = await contract.publicMintStartTimestamp()
        return new Date(Number(timestamp) * 1000)
    }, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    })
    const { data: startDate, mutate: mutateStartDate } = mintStartDateResponse

    const mintEndDateResponse = useSWR('publicMintEndTimestamp', async () => {
        const timestamp: bigint = await contract.publicMintEndTimestamp()
        return new Date(Number(timestamp) * 1000)
    }, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    })
    const { data: endDate, mutate: mutateEndDate } = mintEndDateResponse

    const onMintAvailablePeriodChanged = useCallback((payload: ContractEventPayload) => {
        const startTimestamp: bigint = payload.args.startTimestamp
        const endTimestamp: bigint = payload.args.endTimestamp
        mutateStartDate(new Date(Number(startTimestamp) * 1000))
        mutateEndDate(new Date(Number(endTimestamp) * 1000))
    }, [mutateStartDate, mutateEndDate])

    useEvent(contract.filters.PublicMintAvailablePeriodChanged(), onMintAvailablePeriodChanged)

    const [state, setState] = useState<{
        now: number,
    }>({
        now: Date.now(),
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setState(produce(state, draft => {
                draft.now = Date.now()
            }))
        }, 1_000 * 15) // refresh every 15 seconds
        return () => clearInterval(interval)
    }, [])

    const isMintAvailable = startDate && endDate && state.now >= startDate.getTime() && state.now <= endDate.getTime()

    return <>
        {isMintAvailable ? whenAvailable() : null}
        <Mount
            response={mintStartDateResponse}
            loading={() =>
                <Skeleton variant="text" width={130} sx={{ fontSize: '1.25rem' }} />
            }
            success={startDate =>
                <Typography variant='body2'>
                    {t('publicMint.startDateLabel', { date: startDate.toLocaleString(i18n.language) })}
                </Typography>}
        />
        <Mount
            response={mintEndDateResponse}
            loading={() =>
                <Skeleton variant="text" width={130} sx={{ fontSize: '1.25rem' }} />
            }
            success={endDate =>
                <Typography variant='body2'>
                    {t('publicMint.endDateLabel', { date: endDate.toLocaleString(i18n.language) })}
                </Typography>}
        />
    </>
}
