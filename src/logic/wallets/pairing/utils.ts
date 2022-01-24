import { Wallet } from 'bnc-onboard/dist/src/interfaces'

import { PAIRING_MODULE_NAME } from 'src/logic/wallets/pairing/module'

export const isPairingModule = (wallet: Wallet): boolean => {
  return wallet.name === PAIRING_MODULE_NAME
}
