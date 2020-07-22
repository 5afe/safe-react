import { getInfuraUrl } from '../getWeb3'

const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet'

const PORTIS_DAPP_ID = isMainnet ? process.env.REACT_APP_PORTIS_ID : '852b763d-f28b-4463-80cb-846d7ec5806b'
// const SQUARELINK_CLIENT_ID = isMainnet ? process.env.REACT_APP_SQUARELINK_ID : '46ce08fe50913cfa1b78'
const FORTMATIC_API_KEY = isMainnet ? process.env.REACT_APP_FORTMATIC_KEY : 'pk_test_CAD437AA29BE0A40'

const infuraUrl = getInfuraUrl()

const wallets = [
  { walletName: 'metamask', preferred: true, desktop: false },
  {
    walletName: 'walletConnect',
    preferred: true,
    infuraKey: process.env.REACT_APP_INFURA_TOKEN,
    desktop: true,
    bridge: 'https://safe-walletconnect.gnosis.io/',
  },
  {
    walletName: 'trezor',
    appUrl: 'gnosis-safe.io',
    preferred: true,
    email: 'safe@gnosis.io',
    desktop: true,
    rpcUrl: infuraUrl,
  },
  {
    walletName: 'ledger',
    desktop: true,
    preferred: true,
    rpcUrl: infuraUrl,
    LedgerTransport: (window as any).TransportNodeHid,
  },
  { walletName: 'trust', preferred: true, desktop: false },
  { walletName: 'dapper', desktop: false },
  {
    walletName: 'fortmatic',
    apiKey: FORTMATIC_API_KEY,
    desktop: true,
  },
  {
    walletName: 'portis',
    apiKey: PORTIS_DAPP_ID,
    desktop: true,
  },
  { walletName: 'authereum', desktop: false },
  { walletName: 'torus', desktop: true },
  { walletName: 'unilogin', desktop: true },
  { walletName: 'coinbase', desktop: false },
  { walletName: 'walletLink', rpcUrl: infuraUrl, desktop: false },
  { walletName: 'opera', desktop: false },
  { walletName: 'operaTouch', desktop: false },
]

export const getSupportedWallets = () => {
  const { isDesktop } = window as any
  /* eslint-disable no-unused-vars */

  if (isDesktop) return wallets.filter((wallet) => wallet.desktop).map(({ desktop, ...rest }) => rest)

  return wallets.map(({ desktop, ...rest }) => rest)
}
