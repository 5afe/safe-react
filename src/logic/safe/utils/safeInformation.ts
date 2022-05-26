import { getSafeInfo as fetchSafeInfo, SafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { _getChainId } from 'src/config'

const GATEWAY_ERROR = /1337|42/

export const getSafeInfo = async (safeAddress: string): Promise<SafeInfo> => {
  try {
    return await fetchSafeInfo(_getChainId(), safeAddress)
  } catch (e) {
    const safeNotFound = GATEWAY_ERROR.test(e.message)
    throw new CodedException(safeNotFound ? Errors._605 : Errors._613, e.message)
  }
}
