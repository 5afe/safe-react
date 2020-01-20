// @flow
import React from 'react'
import Onboard from 'bnc-onboard'
import Button from '~/components/layout/Button'
import { fetchProvider, removeProvider } from '~/logic/wallets/store/actions'
import { getNetworkId } from '~/config'
import { store } from '~/store'

const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet'

const BLOCKNATIVE_API_KEY = isMainnet ? process.env.REACT_APP_BLOCKNATIVE_KEY : '7fbb9cee-7e97-4436-8770-8b29a9a8814c'
const PORTIS_DAPP_ID = isMainnet ? process.env.REACT_APP_PORTIS_ID : '852b763d-f28b-4463-80cb-846d7ec5806b'
// const SQUARELINK_CLIENT_ID = isMainnet ? process.env.REACT_APP_SQUARELINK_ID : '46ce08fe50913cfa1b78'
const FORTMATIC_API_KEY = isMainnet ? process.env.REACT_APP_FORTMATIC_KEY : 'pk_test_CAD437AA29BE0A40'
process.env.REACT_APP_INFURA_TOKEN

export const onboard = new Onboard({
  dappId: BLOCKNATIVE_API_KEY,
  network: getNetworkId(),
  subscriptions: {
    wallet: (wallet) => store.dispatch(fetchProvider(wallet.provider)),
  },
})

// web3Connect.on('disconnect', () => {
//   store.dispatch(removeProvider())
// })

type Props = {
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const ConnectButton = (props: Props) => (
  <Button
    color="primary"
    variant="contained"
    minWidth={140}
    onClick={() => {
      onboard.walletSelect()
    }}
    {...props}
  >
    Connect
  </Button>
)

export default ConnectButton
