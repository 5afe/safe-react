import { WalletState } from '@web3-onboard/core'

import { getDisabledWallets } from 'src/config'
import { getPairingConnector, PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing'
import { getOnboardState } from 'src/logic/wallets/onboard'
import { CGW_WALLETS, WALLET_MODULE_LABELS } from '../onboard/wallets'

export const isPairingSupported = (): boolean => {
  return !getDisabledWallets().some((label) => [WALLET_MODULE_LABELS.PAIRING, CGW_WALLETS.SAFE_MOBILE].includes(label))
}

// Is web3-onboard using pairing wallet
export const isPairingWallet = (label: WalletState['label'] = getOnboardState().wallet.label): boolean => {
  return label === PAIRING_MODULE_NAME
}

export const isUriLoaded = (uri: string): boolean => {
  return !!uri && !uri.endsWith('key=')
}

export const getPairingUri = (uri = getPairingConnector().uri): string => {
  const PAIRING_MODULE_URI_PREFIX = 'safe-'
  return isUriLoaded(uri) ? `${PAIRING_MODULE_URI_PREFIX}${uri}` : ''
}
