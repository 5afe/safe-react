import { getSafeInfo as fetchSafeInfo, SafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { getClientGatewayUrl, getNetworkId } from 'src/config'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SafeRecordProps } from '../store/models/safe'
import { SafeRecordWithNames } from '../store/selectors'

export const getSafeInfo = async (safeAddress: string): Promise<SafeInfo> => {
  try {
    return await fetchSafeInfo(getClientGatewayUrl(), getNetworkId().toString(), safeAddress)
  } catch (e) {
    throw new CodedException(Errors._605, e.message)
  }
}

export const isSafeAdded = (addedSafes: SafeRecordWithNames[] | SafeRecordProps[], address: string): boolean =>
  addedSafes.some((safe: SafeRecordWithNames | SafeRecordProps) => sameAddress(safe.address, address))
