import { getSafeInfo as fetchSafeInfo, SafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SafeRecordProps } from '../store/models/safe'
import { SafeRecordWithNames } from '../store/selectors'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { currentNetworkId } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

const GATEWAY_ERROR = /1337|42/

export const getSafeInfo = async (safeAddress: string): Promise<SafeInfo> => {
  const state = store.getState()
  try {
    return await fetchSafeInfo(CONFIG_SERVICE_URL, currentNetworkId(state), safeAddress)
  } catch (e) {
    const safeNotFound = GATEWAY_ERROR.test(e.message)
    throw new CodedException(safeNotFound ? Errors._605 : Errors._613, e.message)
  }
}

export const isSafeAdded = (addedSafes: SafeRecordWithNames[] | SafeRecordProps[], address: string): boolean =>
  addedSafes.some((safe: SafeRecordWithNames | SafeRecordProps) => sameAddress(safe.address, address))
