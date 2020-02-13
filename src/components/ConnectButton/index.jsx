// @flow
import React from 'react'
import Onboard from 'bnc-onboard'
import Button from '~/components/layout/Button'
import { fetchProvider } from '~/logic/wallets/store/actions'
import transactionDataCheck from '~/logic/wallets/transactionDataCheck'
import { setWeb3, getWeb3 } from '~/logic/wallets/getWeb3'
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
  {
    walletName: 'trezor',
    appUrl: 'gnosis-safe.io',
    preferred: true,
    email: 'safe@gnosis.io',
    rpcUrl: 'https://rinkeby.infura.io/v3/b42c928da8fd4c1f90374b18aa9ac6ba',
  },
  {
    walletName: 'ledger',
    preferred: true,
    rpcUrl: 'https://rinkeby.infura.io/v3/b42c928da8fd4c1f90374b18aa9ac6ba',
  },
  { walletName: 'trust', preferred: true },
  { walletName: 'dapper' },
  {
    walletName: 'fortmatic',
    apiKey: FORTMATIC_API_KEY,
  },
  {
    walletName: 'portis',
    apiKey: PORTIS_DAPP_ID,
    label: 'Login with Email',
  },
  { walletName: 'authereum' },
  { walletName: 'coinbase' },
  { walletName: 'opera' },
  { walletName: 'operaTouch' },
]

let lastUsedAddress = ''
let providerName

export const onboard = new Onboard({
  dappId: BLOCKNATIVE_API_KEY,
  networkId: getNetworkId(),
  subscriptions: {
    wallet: (wallet) => {
      if (wallet.provider) {
        // this function will intialize web3 and store it somewhere available throughout the dapp and
        // can also instantiate your contracts with the web3 instance
        setWeb3(wallet.provider)
        providerName = wallet.name
        // store.dispatch(fetchProvider(providerName))
      }
    },
    address: (address) => {
      if (!lastUsedAddress && address) {
        lastUsedAddress = address
        store.dispatch(fetchProvider(providerName))
      }
      // we don't have an unsubscribe event so we rely on this
      if (!address && lastUsedAddress) {
        lastUsedAddress = ''
        providerName = undefined
        // store.dispatch(removeProvider())
      }
    },
  },
  walletSelect: {
    wallets,
  },
  walletCheck: [
    { checkName: 'connect' },
    transactionDataCheck(),
    { checkName: 'network' },
    { checkName: 'accounts' },
  ],
})

export const onboardUser = async () => {
  // before calling walletSelect you want to check if web3 has been instantiated
  // which indicates that a wallet has already been selected
  // and web3 has been instantiated with that provider
  const web3 = getWeb3()
  const walletSelected = web3 ? true : await onboard.walletSelect()
  return walletSelected && onboard.walletCheck()
}

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
