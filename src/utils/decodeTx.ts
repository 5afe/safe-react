import { getDecodedData, DecodedDataResponse } from '@gnosis.pm/safe-react-gateway-sdk'

import { _getChainId } from 'src/config'
import { GATEWAY_URL } from './constants'

export const fetchTxDecoder = async (encodedData: string): Promise<DecodedDataResponse | null> => {
  if (!encodedData?.length || encodedData === '0x') {
    return null
  }

  try {
    return await getDecodedData(GATEWAY_URL, _getChainId(), encodedData)
  } catch (error) {
    return null
  }
}
