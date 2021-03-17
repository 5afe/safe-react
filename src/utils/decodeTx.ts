import axios from 'axios'

import { getTxServiceUrl } from 'src/config'
import { DataDecoded } from 'src/types/transactions/decode.d'

export const fetchTxDecoder = async (txData: string): Promise<DataDecoded | null> => {
  if (!txData?.length || txData === '0x') {
    return null
  }

  const url = `${getTxServiceUrl()}/data-decoder/`
  try {
    const res = await axios.post<DataDecoded>(url, { data: txData })
    return res.data
  } catch (error) {
    return null
  }
}
