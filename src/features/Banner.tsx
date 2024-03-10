import Image from 'mui-image'

import { Avatar, Box, Typography } from '@mui/material'

export default () => {
    const title = process.env.REACT_APP_TITLE
    const iconImageUrl = process.env.REACT_APP_ICON_IMAGE_URL
    const bannerImageUrl = process.env.REACT_APP_BANNER_IMAGE_URL

    if (!title || !iconImageUrl || !bannerImageUrl) {
        console.error('REACT_APP_TITLE, REACT_APP_ICON_IMAGE_URL, or REACT_APP_BANNER_IMAGE_URL is not set.')
        return null
    }

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
                <Typography
                    position='relative'
                    fontSize='3vw'
                    margin='1vw 0'
                    color='white'
                    fontWeight='bold'>
                    {title}
                </Typography>
            </Box>
        </Box>
    </>
}