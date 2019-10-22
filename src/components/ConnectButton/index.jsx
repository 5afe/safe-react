// @flow
import React, { useEffect } from 'react'
import { withSnackbar } from 'notistack'
import { connect } from 'react-redux'
import Web3Connect from 'web3connect'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Portis from '@portis/web3'
import Fortmatic from 'fortmatic'
import Button from '~/components/layout/Button'
import { fetchProvider } from '~/logic/wallets/store/actions'

const web3Connect = new Web3Connect.Core({
  network: 'rinkeby',
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.INFURA_ID,
      },
    },
    portis: {
      package: Portis,
      options: {
        id: '852b763d-f28b-4463-80cb-846d7ec5806b',
      },
    },
    fortmatic: {
      package: Fortmatic,
      options: {
        key: 'pk_test_43A53775AE976718',
      },
    },
  },
})

type Props = {
  registerProvider: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const ConnectButton = ({
  registerProvider, enqueueSnackbar, closeSnackbar, ...props
}: Props) => {
  useEffect(() => {
    web3Connect.on('connect', (provider: any) => {
      if (provider) {
        registerProvider(provider, enqueueSnackbar, closeSnackbar)
      }
    })
  }, [])

  return (
    <Button
      color="primary"
      variant="contained"
      minWidth={140}
      onClick={() => {
        web3Connect.toggleModal()
      }}
      {...props}
    >
      Connect
    </Button>
  )
}

export default connect(
  null,
  { registerProvider: fetchProvider },
)(withSnackbar(ConnectButton))
