// @flow
import axios from 'axios'
import { getTxServiceHost } from '~/config'

const fetchTokenCurrenciesBalances = (safeAddress: string) => {
  if (!safeAddress) {
    return null
  }
  const apiUrl = getTxServiceHost()
  const url = `${apiUrl}safes/${safeAddress}/balances/usd`

  return axios.get(url)
}

export default fetchTokenCurrenciesBalances
