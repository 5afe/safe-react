import axios from 'axios'

import { getDataDecoderUrl } from 'src/config'
import { DecodedData } from 'src/types/transactions/decode.d'

export const fetchTxDecoder = async (txData: string): Promise<DecodedData | null> => {
  if (!txData?.length || txData === '0x') {
    return null
  }

  try {
    const res = await axios.post<DecodedData>(getDataDecoderUrl(), { data: txData })
    return res.data
  } catch (error) {
    return null
  }
}
