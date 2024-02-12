import useEtherSWR from 'ether-swr'
import { ethers } from 'ethers'
import { produce } from 'immer'
import { FormEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, TextField } from '@mui/material'
import { useWeb3React } from '@web3-react/core'

import IERC721 from '../web3/abi/IERC721.json'
import IPublicMintable from '../web3/abi/IPublicMintable.json'

export default () => {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
    // const interfaceIERC721 = new ethers.Contract(contractAddress, IERC721.abi, provider)
    // const interfaceIPublicMintable = new ethers.utils.Interface(IPublicMintable.abi)

    const { t } = useTranslation()
    const { account, isActive } = useWeb3React()

    const [state, setState] = useState<{
        amount?: number,
    }>({
        amount: 1,
    })

    // const sendTransaction = useCallback(async (eth: string) => {
    //     if (!connectedWallets.length) return
    //     const senderAddress = connectedWallets[0].accounts[0].address
    //     const provider = connectedWallets[0].provider

    // }, [])


    const handleMint: FormEventHandler<HTMLFormElement> = useCallback(async event => {
        event.preventDefault()
        if (!isActive) return

    }, [account, isActive])

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
                    disabled={!isActive}>
                    {t('publicMint.mintButton.label')}
                </Button>
            </form >
        </Card>
    </>
}