// @flow
import * as React from 'react'
import Web3Connect from 'web3connect'
import Button from '~/components/layout/Button'
import Web3Integration from '~/logic/wallets/web3Integration'

const web3Connect = new Web3Connect.Core({
  network: 'rinkeby',
  providerOptions: {
    portis: {
      id: '852b763d-f28b-4463-80cb-846d7ec5806b',
    },
    fortmatic: {
      key: 'pk_test_43A53775AE976718',
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
