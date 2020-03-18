// @flow

const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet'

const PORTIS_DAPP_ID = isMainnet ? process.env.REACT_APP_PORTIS_ID : '852b763d-f28b-4463-80cb-846d7ec5806b'
// const SQUARELINK_CLIENT_ID = isMainnet ? process.env.REACT_APP_SQUARELINK_ID : '46ce08fe50913cfa1b78'
const FORTMATIC_API_KEY = isMainnet ? process.env.REACT_APP_FORTMATIC_KEY : 'pk_test_CAD437AA29BE0A40'
const wallets = [
  { walletName: 'metamask', preferred: true, desktop: false },
  {
    walletName: 'walletConnect',
    preferred: true,
    infuraKey: process.env.REACT_APP_INFURA_TOKEN,
    desktop: true,
  },
  {
    walletName: 'trezor',
    appUrl: 'gnosis-safe.io',
    preferred: true,
    email: 'safe@gnosis.io',
    desktop: true,
    rpcUrl: 'https://rinkeby.infura.io/v3/b42c928da8fd4c1f90374b18aa9ac6ba',
  },
  {
    walletName: 'ledger',
    desktop: true,
    preferred: true,
    rpcUrl: 'https://rinkeby.infura.io/v3/b42c928da8fd4c1f90374b18aa9ac6ba',
    LedgerTransport: window.TransportNodeHid,
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
    label: 'Login with Email',
    desktop: true,
  },
  { walletName: 'authereum', desktop: false },
  { walletName: 'coinbase', desktop: false },
  { walletName: 'opera', desktop: false },
  { walletName: 'operaTouch', desktop: false },
]

const isDesktop = () => window && window.process && window.process.type

export const selectWallets = () => {
  const desktopMode = isDesktop()
  //eslint-disable-next-line
  console.log('desktop', desktopMode)
  /* eslint-disable no-unused-vars */

  if (desktopMode) return wallets.filter(wallet => wallet.desktop).map(({ desktop, ...rest }) => rest)

  return wallets.map(({ desktop, ...rest }) => rest)
}
