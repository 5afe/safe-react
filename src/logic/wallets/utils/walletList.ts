import { WalletInitOptions, WalletModule, WalletSelectModuleOptions } from 'bnc-onboard/dist/src/interfaces'

import { getRpcServiceUrl, getDisabledWallets, getChainById } from 'src/config'
import { ChainId, CHAIN_ID, WALLETS } from 'src/config/chain.d'
import { FORTMATIC_KEY, PORTIS_ID, WC_BRIDGE } from 'src/utils/constants'
import getPairingModule from 'src/logic/wallets/pairing/module'
import { isPairingSupported } from 'src/logic/wallets/pairing/utils'
import { getChains } from 'src/config/cache/chains'
import getE2EWalletModule from '../e2e-wallet/module'

type Wallet = (WalletInitOptions | WalletModule) & {
  desktop: boolean // Whether wallet supports desktop app
  walletName: WALLETS
}

const wallets = (chainId: ChainId): Wallet[] => {
  // Ensure RPC matches chainId drilled from Onboard init
  const { rpcUri } = getChainById(chainId)
  const rpcUrl = getRpcServiceUrl(rpcUri)

  return [
    { walletName: WALLETS.METAMASK, preferred: true, desktop: false }
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

  if (chainId === CHAIN_ID.RINKEBY && window.Cypress && window.Cypress.env('CYPRESS_MNEMONIC')) {
    supportedWallets.push(getE2EWalletModule())
  }

  return isPairingSupported() ? [getPairingModule(chainId), ...supportedWallets] : supportedWallets
}
