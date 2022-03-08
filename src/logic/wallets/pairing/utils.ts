import { WalletState } from '@web3-onboard/core'

import { getDisabledWallets } from 'src/config'
import { getPairingConnector, PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing'
import { getOnboardState } from 'src/logic/wallets/onboard'
import { CGW_WALLETS, WALLET_MODULE_LABELS } from '../onboard/wallets'

// Create WC session for pairing
export const initPairing = async (): Promise<void> => {
  const connector = getPairingConnector()
  if (!connector.connected) {
    await connector.createSession()
  }
}

export const isPairingConnected = (): boolean => {
  const { connected } = getPairingConnector()
  return connected
}

export const isPairingSupported = (): boolean => {
  return !getDisabledWallets().some((label) => [WALLET_MODULE_LABELS.PAIRING, CGW_WALLETS.SAFE_MOBILE].includes(label))
}

// Is web3-onboard using pairing wallet
export const isPairingWallet = (label: WalletState['label'] = getOnboardState().wallet.label): boolean => {
  return label === PAIRING_MODULE_NAME
}

export const getPairingUri = (): string => {
  const PAIRING_MODULE_URI_PREFIX = 'safe-'
  const { uri } = getPairingConnector()
  return uri ? `${PAIRING_MODULE_URI_PREFIX}${uri}` : ''
}
