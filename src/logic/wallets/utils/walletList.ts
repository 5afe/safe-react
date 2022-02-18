import { WalletInitOptions, WalletSelectModuleOptions } from 'bnc-onboard/dist/src/interfaces'

import { getRpcServiceUrl, getDisabledWallets, getChainById } from 'src/config'
import { ChainId, WALLETS } from 'src/config/chain.d'
import { FORTMATIC_KEY, PORTIS_ID } from 'src/utils/constants'
import patchedWalletConnect from '../patchedWalletConnect'

type Wallet = WalletInitOptions & {
  desktop: boolean
  walletName: WALLETS
}

const wallets = (chainId: ChainId): Wallet[] => {
  // Ensure RPC matches chainId drilled from Onboard init
  const { rpcUri } = getChainById(chainId)
  const rpcUrl = getRpcServiceUrl(rpcUri)

  return [
    { walletName: WALLETS.METAMASK, preferred: true, desktop: false },
    // A patched version of WalletConnect is spliced in at this index
    // { preferred: true, desktop: true }
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

const getPlatformSupportedWallets = (chainId: ChainId): WalletInitOptions[] => {
  if (window.isDesktop) {
    return wallets(chainId)
      .filter(({ desktop }) => desktop)
      .map(({ desktop, ...rest }) => rest)
  }

  return wallets(chainId)
    .map(({ desktop, ...rest }) => rest)
    .filter(({ walletName }) => !getDisabledWallets().includes(walletName))
}

export const getSupportedWallets = (chainId: ChainId): WalletSelectModuleOptions['wallets'] => {
  const wallets: WalletSelectModuleOptions['wallets'] = getPlatformSupportedWallets(chainId)

  if (!getDisabledWallets().includes(WALLETS.WALLET_CONNECT)) {
    const wc = patchedWalletConnect(chainId)
    // Inset patched WC module at index 1
    wallets.splice(1, 0, wc)
  }

  return wallets
}
