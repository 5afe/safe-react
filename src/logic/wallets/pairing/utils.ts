import { Wallet } from 'bnc-onboard/dist/src/interfaces'

import { getDisabledWallets } from 'src/config'
import { PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'
import { WALLETS } from 'src/config/chain.d'
import onboard from 'src/logic/wallets/onboard'

export const initPairing = async (): Promise<void> => {
  await onboard().walletSelect(PAIRING_MODULE_NAME)
}

// Is WC connected (may work for other providers)
export const isPairingConnected = (): boolean => {
  return onboard().getState().wallet.provider?.connected
}

export const isPairingSupported = (): boolean => {
  return !getDisabledWallets().includes(WALLETS.SAFE_MOBILE)
}

// Is pairing module initialised
export const isPairingModule = (name: Wallet['name'] = onboard().getState().wallet?.name): boolean => {
  return name === PAIRING_MODULE_NAME
}

export const getPairingUri = (): string | undefined => {
  const wcUri = onboard().getState().wallet.provider?.wc?.uri
  const PAIRING_MODULE_URI_PREFIX = 'safe-'
  return wcUri ? `${PAIRING_MODULE_URI_PREFIX}${wcUri}` : undefined
}
