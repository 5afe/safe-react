import { getSafeInfo as fetchSafeInfo, SafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { getClientGatewayUrl, getNetworkId } from 'src/config'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SafeRecordProps } from '../store/models/safe'
import { SafeRecordWithNames } from '../store/selectors'

const GATEWAY_ERROR = /1337|42/

export const getSafeInfo = async (safeAddress: string): Promise<SafeInfo> => {
  try {
    return await fetchSafeInfo(getClientGatewayUrl(), getNetworkId().toString(), safeAddress)
  } catch (e) {
    const safeNotFound = GATEWAY_ERROR.test(e.message)
    throw new CodedException(safeNotFound ? Errors._605 : Errors._613, e.message)
  }
}

export const isSafeAdded = (addedSafes: SafeRecordWithNames[] | SafeRecordProps[], address: string): boolean =>
  addedSafes.some((safe: SafeRecordWithNames | SafeRecordProps) => sameAddress(safe.address, address))
