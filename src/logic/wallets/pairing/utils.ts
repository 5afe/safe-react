import { Wallet } from 'bnc-onboard/dist/src/interfaces'

import { getDisabledWallets } from 'src/config'
import { PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'
import { WALLETS } from 'src/config/chain.d'
import onboard from 'src/logic/wallets/onboard'

export const isPairingSupported = (): boolean => {
  return !getDisabledWallets().includes(WALLETS.SAFE_MOBILE)
}

// Is pairing module initialised
export const isPairingModule = (name: Wallet['name'] = onboard().getState().wallet?.name): boolean => {
  return name === PAIRING_MODULE_NAME
}

export const getPairingUri = (wcUri: string): string => {
  const PAIRING_MODULE_URI_PREFIX = 'safe-'
  return wcUri ? `${PAIRING_MODULE_URI_PREFIX}${wcUri}` : ''
}
