// import { getGuardInstance } from 'src/logic/contracts/safeContracts'
// import { GUARD_ADDRESS } from 'src/utils/constants'

const ADDRESS_ZERO = '0x0'

export const getSetGuardTxData = (address: string): string => {
  //const guardInstance = getGuardInstance(GUARD_ADDRESS)

  return address // guardInstance.methods.setGuard(address).encodeABI()
}

export const getRemoveGuardTxData = (): string => {
  return getSetGuardTxData(ADDRESS_ZERO)
}
