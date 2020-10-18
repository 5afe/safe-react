import axios, { AxiosResponse } from 'axios'

import { getTxServiceUrl } from 'src/config'
import { TokenProps } from 'src/logic/tokens/store/model/token'

type BalanceResult = {
  tokenAddress: string
  token: TokenProps
  balance: string
}

export const fetchTokenBalanceList = (safeAddress: string): Promise<AxiosResponse<{ results: BalanceResult[] }>> => {
  const apiUrl = getTxServiceUrl()
  const url = `${apiUrl}/safes/${safeAddress}/balances/`

  return axios.get(url)
}
