import { WalletInitOptions, WalletModule, WalletSelectModuleOptions } from 'bnc-onboard/dist/src/interfaces'

import { getRpcServiceUrl, getDisabledWallets, getChainById } from 'src/config'
import { ChainId, WALLETS } from 'src/config/chain.d'
import { FORTMATIC_KEY, INFURA_TOKEN, PORTIS_ID } from 'src/utils/constants'
import getPairingModule from 'src/logic/wallets/pairing/module'
import { isPairingSupported } from 'src/logic/wallets/pairing/utils'
import { getChains } from 'src/config/cache/chains'

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
    {
      walletName: WALLETS.WALLET_CONNECT,
      preferred: true,
      infuraKey: INFURA_TOKEN,
      rpc: getChains().reduce((map, { chainId, rpcUri }) => {
        return {
          ...map,
          [chainId]: getRpcServiceUrl(rpcUri),
        }
      }, {}),
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

export const isSupportedWallet = (name: WALLETS) => {
  return !getDisabledWallets().includes(name)
}

export const getSupportedWallets = (chainId: ChainId): WalletSelectModuleOptions['wallets'] => {
  const supportedWallets = wallets(chainId)
    .filter(({ walletName, desktop }) => {
      // Desktop vs. Web app wallet support
      return isSupportedWallet(walletName) && window.isDesktop ? desktop : true
    })
    .map(({ desktop: _, ...rest }) => rest)

  // Pairing must be 1st in list (to hide via CSS)
  return isPairingSupported() ? [getPairingModule(chainId), ...supportedWallets] : supportedWallets
}
