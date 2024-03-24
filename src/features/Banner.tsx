import { ContractEventPayload } from 'ethers'
import Image from 'mui-image'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { Avatar, Box, Stack, Typography } from '@mui/material'

import contract from '../web3/contract'
import { useEvent } from '../web3/hooks/useEvent'

export default () => {
    const { t } = useTranslation()

    const { data: lastTokenId } = useSWR('publicMintLastTokenId', (): Promise<bigint> => contract.publicMintLastTokenId(), {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    })

    const { data: totalSupply, mutate: mutateTotalSupply } = useSWR('totalSupply', (): Promise<bigint> => contract.totalSupply(), {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    })

    useEvent(contract.filters.Transfer(null, null, null), (payload: ContractEventPayload) => mutateTotalSupply(payload.args.tokenId))

    const title = process.env.REACT_APP_TITLE
    const iconImageUrl = process.env.REACT_APP_ICON_IMAGE_URL
    const bannerImageUrl = process.env.REACT_APP_BANNER_IMAGE_URL

    if (!title || !iconImageUrl || !bannerImageUrl) {
        console.error('REACT_APP_TITLE, REACT_APP_ICON_IMAGE_URL, or REACT_APP_BANNER_IMAGE_URL is not set.')
        return null
    }

    const min = (...args: bigint[]) => args.reduce((a, b) => a < b ? a : b, args[0])
    const publicMintProgress = lastTokenId !== undefined && totalSupply !== undefined
        ? t('banner.publicMintProgressLabel', { numerator: min(lastTokenId, totalSupply), denominator: lastTokenId })
        : t('banner.publicMintProgressLoadingLabel')

    return <>
        <Box
            position='relative'
            height='28vw'>
            <Image
                src={bannerImageUrl}
                showLoading
                position='absolute' />
            <Box
                position='absolute'
                bottom='0'
                width='100%'
                textAlign='center'
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                <Stack
                    direction='row'
                    justifyContent='center'
                    alignItems='center'
                    padding='0 3vw'>
                    <Typography
                        fontSize='4vw'
                        display='inline'
                        margin='1vw 0'
                        color='white'
                        fontWeight='bold'
                        marginRight='auto'>
                        {title}
                    </Typography>
                    <Typography
                        fontSize='2.8vw'
                        display='inline'
                        color='white'
                        fontWeight='bold'>
                        {publicMintProgress}
                    </Typography>
                </Stack>
            </Box>
            <Box
                position='absolute'
                top='10vw'
                left='3%'>
                <Avatar
                    src={iconImageUrl}
                    variant='rounded'
                    sx={{
                        width: '12vw',
                        height: '12vw',
                        borderRadius: '20%',
                        position: 'relative',
                    }} />
            </Box>
        </Box>
    </>
}