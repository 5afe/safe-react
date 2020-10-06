import { WalletInitOptions } from 'bnc-onboard/dist/src/interfaces'

import { getNetworkId, getRpcServiceUrl } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { FORTMATIC_KEY, PORTIS_ID } from 'src/utils/constants'

const networkId = getNetworkId()
const PORTIS_DAPP_ID = PORTIS_ID[networkId] ?? PORTIS_ID[ETHEREUM_NETWORK.RINKEBY]
const FORTMATIC_API_KEY = FORTMATIC_KEY[networkId] ?? FORTMATIC_KEY[ETHEREUM_NETWORK.RINKEBY]

type Wallet = WalletInitOptions & {
  desktop: boolean
}

const rpcUrl = getRpcServiceUrl()
const wallets: Wallet[] = [
  { walletName: 'metamask', preferred: true, desktop: false },
  {
    walletName: 'walletConnect',
    preferred: true,
    // as stated in the documentation, `infuraKey` is not mandatory if rpc is provided
    rpc: { [networkId]: rpcUrl },
    desktop: true,
    bridge: 'https://safe-walletconnect.gnosis.io/',
  },
  {
    walletName: 'trezor',
    appUrl: 'gnosis-safe.io',
    preferred: true,
    email: 'safe@gnosis.io',
    desktop: true,
    rpcUrl,
  },
  {
    walletName: 'ledger',
    desktop: true,
    preferred: true,
    rpcUrl,
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
  { walletName: 'walletLink', rpcUrl, desktop: false },
  { walletName: 'opera', desktop: false },
  { walletName: 'operaTouch', desktop: false },
]

export const getSupportedWallets = (): WalletInitOptions[] => {
  const { isDesktop } = window as any
  /* eslint-disable no-unused-vars */

  if (isDesktop) {
    return wallets.filter((wallet) => wallet.desktop).map(({ desktop, ...rest }) => rest)
  }

  return wallets.map(({ desktop, ...rest }) => rest)
}
