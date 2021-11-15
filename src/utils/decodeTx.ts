import axios from 'axios'
import { currentTxServiceUrl } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

import { DecodedData } from 'src/types/transactions/decode.d'

export const fetchTxDecoder = async (txData: string): Promise<DecodedData | null> => {
  if (!txData?.length || txData === '0x') {
    return null
  }

  const txServiceUrl = currentTxServiceUrl(store.getState())
  const url = `${txServiceUrl}/data-decoder/`
  try {
    const res = await axios.post<DecodedData>(url, { data: txData })
    return res.data
  } catch (error) {
    return null
  }
}
