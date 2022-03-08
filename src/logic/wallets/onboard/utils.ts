import { saveToStorageWithExpiry, loadFromStorageWithExpiry } from 'src/utils/storage'
import { isPairingWallet } from 'src/logic/wallets/pairing/utils'

const LAST_USED_WALLET_KEY = 'SAFE__lastUsedWallet'

export const saveLastUsedWallet = (label: string): void => {
  const expireInDays = (days: number) => 60 * 60 * 24 * 1000 * days
  const expiry = isPairingWallet(label) ? expireInDays(1) : expireInDays(365)
  saveToStorageWithExpiry(LAST_USED_WALLET_KEY, label, expiry)
}

export const loadLastUsedWallet = (): string | undefined => {
  return loadFromStorageWithExpiry<string>(LAST_USED_WALLET_KEY)
}
