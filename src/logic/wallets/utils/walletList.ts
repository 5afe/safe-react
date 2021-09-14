import { WalletInitOptions } from 'bnc-onboard/dist/src/interfaces'

import { getNetworkId, getRpcServiceUrl, getNetworkConfigDisabledWallets } from 'src/config'
import { WALLETS } from 'src/config/networks/network.d'
import { FORTMATIC_KEY, PORTIS_ID } from 'src/utils/constants'

type Wallet = WalletInitOptions & {
  desktop: boolean
  walletName: WALLETS
}

const wallets = (): Wallet[] => {
  const rpcUrl = getRpcServiceUrl()

  return [
    { walletName: WALLETS.METAMASK, preferred: true, desktop: false },
    {
      walletName: WALLETS.WALLET_CONNECT,
      preferred: true,
      // as stated in the documentation, `infuraKey` is not mandatory if rpc is provided
      rpc: { [getNetworkId()]: rpcUrl },
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
    {
      walletName: WALLETS.KEYSTONE,
      desktop: false,
      rpcUrl,
      appName: 'Gnosis Safe',
    },
    { walletName: WALLETS.TRUST, preferred: true, desktop: false },
    {
      walletName: WALLETS.LATTICE,
      rpcUrl,
      appName: 'Gnosis Safe',
      desktop: false,
    },
    {
      walletName: WALLETS.FORTMATIC,
      apiKey: FORTMATIC_KEY,
      desktop: true,
    },
    {
      walletName: WALLETS.PORTIS,
      apiKey: PORTIS_ID,
      desktop: true,
    },
    { walletName: WALLETS.AUTHEREUM, desktop: false },
    { walletName: WALLETS.TORUS, desktop: true },
    { walletName: WALLETS.COINBASE, desktop: false },
    { walletName: WALLETS.WALLET_LINK, rpcUrl, desktop: false },
    { walletName: WALLETS.OPERA, desktop: false },
    { walletName: WALLETS.OPERA_TOUCH, desktop: false },
  ]
}

export const getSupportedWallets = (): WalletInitOptions[] => {
  const disabledWallets = getNetworkConfigDisabledWallets()

  const { isDesktop } = window
  /* eslint-disable no-unused-vars */
  if (isDesktop) {
    return wallets()
      .filter((wallet) => wallet.desktop)
      .map(({ desktop, ...rest }) => rest)
  }

  return wallets()
    .map(({ desktop, ...rest }) => rest)
    .filter((w) => !disabledWallets.includes(w.walletName))
}
