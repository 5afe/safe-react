import { Wallet } from 'bnc-onboard/dist/src/interfaces'

import { getDisabledWallets, _getChainId } from 'src/config'
import { getPairingProvider, PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'
import { WALLETS } from 'src/config/chain.d'
import onboard from 'src/logic/wallets/onboard'

export const initPairing = (): void => {
  onboard().walletSelect(PAIRING_MODULE_NAME)
}

// Is WC connected (may work for other providers)
export const isPairingConnected = (): boolean => {
  return getPairingProvider(_getChainId()).connected
}

export const isPairingSupported = (): boolean => {
  return !getDisabledWallets().includes(WALLETS.SAFE_MOBILE)
}

// Is pairing module initialised
export const isPairingModule = (name: Wallet['name'] = onboard().getState().wallet?.name): boolean => {
  return name === PAIRING_MODULE_NAME
}

export const isPairingUriLoaded = (uri: string): boolean => {
  return uri ? !uri.endsWith('key=') : false
}

// chainId is irrelevant after the pairing provider has been established
export const getPairingUri = (wcUri: string): string => {
  const PAIRING_MODULE_URI_PREFIX = 'safe-'
  return wcUri ? `${PAIRING_MODULE_URI_PREFIX}${wcUri}` : ''
}
