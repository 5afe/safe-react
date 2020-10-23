import { WalletInitOptions } from 'bnc-onboard/dist/src/interfaces'

import { getNetworkId, getRpcServiceUrl, getNetworkConfigDisabledWallets } from 'src/config'
import { ETHEREUM_NETWORK, WALLETS } from 'src/config/networks/network.d'
import { FORTMATIC_KEY, PORTIS_ID } from 'src/utils/constants'

const networkId = getNetworkId()
const disabledWallets = getNetworkConfigDisabledWallets()
const PORTIS_DAPP_ID = PORTIS_ID[networkId] ?? PORTIS_ID[ETHEREUM_NETWORK.RINKEBY]
const FORTMATIC_API_KEY = FORTMATIC_KEY[networkId] ?? FORTMATIC_KEY[ETHEREUM_NETWORK.RINKEBY]

type Wallet = WalletInitOptions & {
  desktop: boolean
  walletName: WALLETS
}

const rpcUrl = getRpcServiceUrl()
const wallets: Wallet[] = [
  { walletName: WALLETS.METAMASK, preferred: true, desktop: false },
  {
    walletName: WALLETS.WALLET_CONNECT,
    preferred: true,
    // as stated in the documentation, `infuraKey` is not mandatory if rpc is provided
    rpc: { [networkId]: rpcUrl },
    desktop: true,
    bridge: 'https://safe-walletconnect.gnosis.io/',
  },
  {
    walletName: WALLETS.TREZOR,
    appUrl: 'gnosis-safe.io',
    preferred: true,
    email: 'safe@gnosis.io',
    desktop: true,
    rpcUrl,
  },
  {
    walletName: WALLETS.LEDGER,
    desktop: true,
    preferred: true,
    rpcUrl,
    LedgerTransport: (window as any).TransportNodeHid,
  },
  { walletName: WALLETS.TRUST, preferred: true, desktop: false },
  { walletName: WALLETS.DAPPER, desktop: false },
  {
    walletName: WALLETS.FORTMATIC,
    apiKey: FORTMATIC_API_KEY,
    desktop: true,
  },
  {
    walletName: WALLETS.PORTIS,
    apiKey: PORTIS_DAPP_ID,
    desktop: true,
  },
  { walletName: WALLETS.AUTHEREUM, desktop: false },
  { walletName: WALLETS.TORUS, desktop: true },
  { walletName: WALLETS.UNILOGIN, desktop: true },
  { walletName: WALLETS.COINBASE, desktop: false },
  { walletName: WALLETS.WALLET_LINK, rpcUrl, desktop: false },
  { walletName: WALLETS.OPERA, desktop: false },
  { walletName: WALLETS.OPERA_TOUCH, desktop: false },
]

export const getSupportedWallets = (): WalletInitOptions[] => {
  const { isDesktop } = window as any
  /* eslint-disable no-unused-vars */
  if (isDesktop) {
    return wallets.filter((wallet) => wallet.desktop).map(({ desktop, ...rest }) => rest)
  }

  return wallets.map(({ desktop, ...rest }) => rest).filter((w) => !disabledWallets.includes(w.walletName))
}
