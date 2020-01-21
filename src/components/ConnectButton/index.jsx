// @flow
import React from 'react'
import Onboard from 'bnc-onboard'
import Button from '~/components/layout/Button'
import { fetchProvider, removeProvider } from '~/logic/wallets/store/actions'
import { getNetworkId } from '~/config'
import { store } from '~/store'

const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet'

const BLOCKNATIVE_API_KEY = isMainnet
  ? process.env.REACT_APP_BLOCKNATIVE_KEY
  : '7fbb9cee-7e97-4436-8770-8b29a9a8814c'
const PORTIS_DAPP_ID = isMainnet
  ? process.env.REACT_APP_PORTIS_ID
  : '852b763d-f28b-4463-80cb-846d7ec5806b'
// const SQUARELINK_CLIENT_ID = isMainnet ? process.env.REACT_APP_SQUARELINK_ID : '46ce08fe50913cfa1b78'
const FORTMATIC_API_KEY = isMainnet
  ? process.env.REACT_APP_FORTMATIC_KEY
  : 'pk_test_CAD437AA29BE0A40'

const wallets = [
  { walletName: 'metamask', preferred: true },
  {
    walletName: 'walletConnect',
    preferred: true,
    infuraKey: process.env.REACT_APP_INFURA_TOKEN,
  },
  { walletName: 'trust', preferred: true },
  { walletName: 'dapper' },
  {
    walletName: 'fortmatic',
    apiKey: FORTMATIC_API_KEY,
    preferred: true,
  },
  {
    walletName: 'portis',
    apiKey: PORTIS_DAPP_ID,
    preferred: true,
    label: 'Login with Email',
  },
  { walletName: 'authereum' },
  { walletName: 'coinbase' },
  { walletName: 'opera', preferred: true },
  { walletName: 'operaTouch', preferred: true },
]

export const onboard = new Onboard({
  dappId: BLOCKNATIVE_API_KEY,
  networkId: getNetworkId(),
  subscriptions: {
    wallet: (wallet) => {
      store.dispatch(fetchProvider(wallet.provider))
    },
    address: (address) => {
      // we don't have an unsubscribe event so we rely on this
      if (!address) {
        store.dispatch(removeProvider())
      }
    },
  },
  walletSelect: {
    wallets,
  },
})

type Props = {
  enqueueSnackbar: Function,
  closeSnackbar: Function
}

const ConnectButton = (props: Props) => (
  <Button
    color="primary"
    variant="contained"
    minWidth={140}
    onClick={async () => {
      await onboard.walletSelect()
      await onboard.walletCheck()
    }}
    {...props}
  >
    Connect
  </Button>
)

export default ConnectButton
