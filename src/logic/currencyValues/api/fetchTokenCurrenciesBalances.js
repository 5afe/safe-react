//
import axios from 'axios'

import { getTxServiceHost } from 'config'

const fetchTokenCurrenciesBalances = (safeAddress) => {
  if (!safeAddress) {
    return null
  }
  const apiUrl = getTxServiceHost()
  const url = `${apiUrl}safes/${safeAddress}/balances/usd/`

  return axios.get(url, {
    params: {
      limit: 3000,
    },
  })
}

export default fetchTokenCurrenciesBalances
