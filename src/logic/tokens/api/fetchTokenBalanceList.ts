import axios from 'axios'

import { getTxServiceUrl } from 'src/config'

export const fetchTokenBalanceList = (safeAddress) => {
  const apiUrl = getTxServiceUrl()
  const url = `${apiUrl}/safes/${safeAddress}/balances/`

  return axios.get(url)
}
