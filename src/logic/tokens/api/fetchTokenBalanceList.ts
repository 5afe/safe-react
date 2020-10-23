import axios, { AxiosResponse } from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { TokenProps } from 'src/logic/tokens/store/model/token'
import { checksumAddress } from 'src/utils/checksumAddress'

type BalanceResult = {
  tokenAddress: string
  token: TokenProps
  balance: string
}

export const fetchTokenBalanceList = (safeAddress: string): Promise<AxiosResponse<{ results: BalanceResult[] }>> => {
  const address = checksumAddress(safeAddress)
  const url = `${getSafeServiceBaseUrl(address)}/balances/`

  return axios.get(url)
}
