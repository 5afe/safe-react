import { WalletInitOptions, WalletModule, WalletSelectModuleOptions } from 'bnc-onboard/dist/src/interfaces'

import { getRpcServiceUrl, getDisabledWallets, getChainById } from 'src/config'
import { ChainId, WALLETS } from 'src/config/chain.d'
import { FORTMATIC_KEY, PORTIS_ID } from 'src/utils/constants'
import getPairingModule from 'src/logic/wallets/pairing/module'
import { isPairingSupported } from 'src/logic/wallets/pairing/utils'
import getPatchedWCModule from 'src/logic/wallets/walletConnect/module'

type Wallet = (WalletInitOptions | WalletModule) & {
  desktop: boolean // Whether wallet supports desktop app
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
      appUrl: 'multisig.boba.network',
      preferred: true,
      email: 'engineering@enya.ai',
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
      appName: 'Boba Multisig',
    },
    { walletName: WALLETS.TRUST, preferred: true, desktop: false },
    {
      walletName: WALLETS.LATTICE,
      rpcUrl,
      appName: 'Boba Multisig',
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

export const isSupportedWallet = (name: WALLETS | string): boolean => {
  return !getDisabledWallets().some((walletName) => {
    // walletName is config wallet name, name is the wallet module name and differ
    return walletName.replace(/\s/g, '').toLowerCase() === name.replace(/\s/g, '').toLowerCase()
  })
}

export const getSupportedWallets = (chainId: ChainId): WalletSelectModuleOptions['wallets'] => {
  const supportedWallets: WalletSelectModuleOptions['wallets'] = wallets(chainId)
    .filter(({ walletName, desktop }) => {
      if (!isSupportedWallet(walletName)) {
        return false
      }
      // Desktop vs. Web app wallet support
      return window.isDesktop ? desktop : true
    })
    .map(({ desktop: _, ...rest }) => rest)

  if (isSupportedWallet(WALLETS.WALLET_CONNECT)) {
    const wc = getPatchedWCModule(chainId)
    // Inset patched WC module at index 1
    supportedWallets?.splice(1, 0, wc)
  }

  // Pairing must be 1st in list (to hide via CSS)
  return isPairingSupported() ? [getPairingModule(chainId), ...supportedWallets] : supportedWallets
}
