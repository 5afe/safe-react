import { WalletInitOptions, WalletModule, WalletSelectModuleOptions } from 'bnc-onboard/dist/src/interfaces'

import { getRpcServiceUrl, getDisabledWallets, getChainById, getPublicRpcUrl } from 'src/config'
import { ChainId, WALLETS } from 'src/config/chain.d'
import { FORTMATIC_KEY, PORTIS_ID, WC_BRIDGE } from 'src/utils/constants'
import getPairingModule from 'src/logic/wallets/pairing/module'
import { isPairingSupported } from 'src/logic/wallets/pairing/utils'
import { getChains } from 'src/config/cache/chains'
import HDWalletProvider from '@truffle/hdwallet-provider'
import { E2E_MNEMONIC } from 'src/utils/constants'

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
    { walletName: WALLETS.TALLYHO, preferred: false, desktop: false },
    {
      walletName: WALLETS.WALLET_CONNECT,
      rpc: getChains().reduce((map, { chainId, rpcUri }) => {
        return {
          ...map,
          [chainId]: getRpcServiceUrl(rpcUri),
        }
      }, {}),
      bridge: WC_BRIDGE,
      preferred: true,
      desktop: true,
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
const getTestWallet = (): WalletModule => ({
  name: 'e2e-wallet',
  type: 'injected',
  wallet: async (helpers) => {
    const { createModernProviderInterface } = helpers
    const provider = new HDWalletProvider({
      mnemonic: E2E_MNEMONIC,
      providerOrUrl: getPublicRpcUrl(),
    })
    return {
      provider,
      interface: createModernProviderInterface(provider),
    }
  },
  desktop: true,
  mobile: true,
})

export const isCypressAskingForConnectedState = (): boolean => {
  return typeof window !== 'undefined' && window.Cypress && window.cypressConfig?.connected
}

export const isSupportedWallet = (name: WALLETS | string): boolean => {
  return !getDisabledWallets().some((walletName) => {
    // walletName is config wallet name, name is the wallet module name and differ
    return walletName.replace(/\s/g, '').toLowerCase() === name.replace(/\s/g, '').toLowerCase()
  })
}

export const getSupportedWallets = (chainId: ChainId): WalletSelectModuleOptions['wallets'] => {
  // E2E test wallet
  if (isCypressAskingForConnectedState()) {
    return [getTestWallet()]
  }

  const supportedWallets: WalletSelectModuleOptions['wallets'] = wallets(chainId)
    .filter(({ walletName, desktop }) => {
      if (!isSupportedWallet(walletName)) {
        return false
      }
      // Desktop vs. Web app wallet support
      return window.isDesktop ? desktop : true
    })
    .map(({ desktop: _, ...rest }) => rest)

  // Pairing must be 1st in list (to hide via CSS)
  return isPairingSupported() ? [getPairingModule(chainId), ...supportedWallets] : supportedWallets
}
