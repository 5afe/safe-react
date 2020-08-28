import axios from 'axios'

import { getTxServiceHost } from 'src/config/index'

const fetchTokenBalanceList = (safeAddress) => {
  const apiUrl = getTxServiceHost()
  const url = `${apiUrl}safes/${safeAddress}/balances/`

  return axios.get(url, {
    params: {
      limit: 3000,
    },
  })
}

export default fetchTokenBalanceList
