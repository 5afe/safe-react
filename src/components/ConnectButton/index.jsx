// @flow
import * as React from 'react'
import Web3Connect from 'web3connect'
import Button from '~/components/layout/Button'
import Web3Integration from '~/logic/wallets/web3Integration'

const web3Connect = new Web3Connect.Core({
  providerOptions: {
    portis: {
      id: 'PORTIS_ID', // required
      network: 'mainnet', // optional
    },
    fortmatic: {
      key: 'FORTMATIC_KEY', // required
      network: 'mainnet', // optional
    },
  },
})

web3Connect.on('connect', (provider: any) => {
  if (provider) {
    Web3Integration.setWeb3(provider)
  }
})

const ConnectButton = (props: Object) => (
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

export default ConnectButton
