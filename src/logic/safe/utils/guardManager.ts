import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

export const getSetGuardTxData = (guardAddress: string, safeAddress: string, safeVersion: string): string => {
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)

  return safeInstance.methods.setGuard(guardAddress).encodeABI()
}

export const getRemoveGuardTxData = (safeAddress: string, safeVersion: string): string => {
  return getSetGuardTxData(ZERO_ADDRESS, safeAddress, safeVersion)
}
