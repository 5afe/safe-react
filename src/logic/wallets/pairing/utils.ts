import { WalletState } from '@web3-onboard/core'
import WalletConnect from '@walletconnect/client'

// import { getDisabledWallets } from 'src/config'
import { PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'
import { getOnboardInstance, getOnboardState } from 'src/logic/wallets/onboard'
// import { CGW_WALLETS, WALLET_MODULE_LABELS } from '../onboard/wallets'

export const initPairing = async (): Promise<void> => {
  await getOnboardInstance().connectWallet({ autoSelect: PAIRING_MODULE_NAME })
}

// Is WC connected (may work for other providers)
export const isPairingConnected = (): boolean => {
  const { wallet } = getOnboardState()
  return ((wallet.provider as any)?.connector as InstanceType<typeof WalletConnect>)?.connected
}

export const isPairingSupported = (): boolean => {
  return false
  // return !getDisabledWallets().some((label) => [WALLET_MODULE_LABELS.PAIRING, CGW_WALLETS.SAFE_MOBILE].includes(label))
}

// Is pairing module initialised
export const isPairingModule = (label: WalletState['label'] = getOnboardState().wallet.label): boolean => {
  return label === PAIRING_MODULE_NAME
}

export const getPairingUri = (): string | undefined => {
  const { wallet } = getOnboardState()
  const wcUri = ((wallet.provider as any)?.connector as InstanceType<typeof WalletConnect>)?.uri
  const PAIRING_MODULE_URI_PREFIX = 'safe-'
  return wcUri ? `${PAIRING_MODULE_URI_PREFIX}${wcUri}` : undefined
}
