import { ethers } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, TextField } from '@mui/material'
import { useWallets } from '@web3-onboard/react'

import IERC721 from '../web3/abi/IERC721.json'
import IPublicMintable from '../web3/abi/IPublicMintable.json'

export default () => {
    const interfaceIERC721 = new ethers.utils.Interface(IERC721.abi)
    const interfaceIPublicMintable = new ethers.utils.Interface(IPublicMintable.abi)

    const { t } = useTranslation()
    const connectedWallets = useWallets()

    const [state, setState] = useState<{
        amount?: number,
    }>({
        amount: 1,
    })

    const sendTransaction = useCallback(async (eth: string) => {
        if (!connectedWallets.length) return
        const senderAddress = connectedWallets[0].accounts[0].address
        const provider = connectedWallets[0].provider

    }, [])


    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()
        if (!connectedWallets.length) return
        const senderAddress = connectedWallets[0].accounts[0].address

    }, [connectedWallets])

    return <>
        <Card>
            <form
                onSubmit={handleMint}
                autoComplete='off'>
                <TextField
                    label={t('publicMint.amountInput.label')}
                    type='number'
                    variant='standard'
                    color='primary'
                    size='small'
                    required
                    value={state.amount?.toString() || ''}
                    onChange={e => {
                        setState(produce(draft => {
                            draft.amount = e.target.value.length === 0
                                ? undefined
                                : Math.max(1, Number(e.target.value))
                        }))
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }} />
                <Button
                    color='inherit'
                    variant='contained'
                    type='submit'
                    disabled={!connectedWallets.length}>
                    {t('publicMint.mintButton.label')}
                </Button>
            </form >
        </Card>
    </>
}