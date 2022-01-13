import { getDecodedData, DecodedDataResponse } from '@gnosis.pm/safe-react-gateway-sdk'

import { getGatewayUrl, _getChainId } from 'src/config'

export const fetchTxDecoder = async (encodedData: string): Promise<DecodedDataResponse | null> => {
  if (!encodedData?.length || encodedData === '0x') {
    return null
  }

  try {
    return await getDecodedData(getGatewayUrl(), _getChainId(), encodedData)
  } catch (error) {
    return null
  }
}
