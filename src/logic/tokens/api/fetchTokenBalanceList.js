// @flow
import axios from 'axios'
import { getTxServiceHost } from '~/config/index'

const fetchTokenBalanceList = (safeAddress: string) => {
  const apiUrl = getTxServiceHost()
  const url = `${apiUrl}safes/${safeAddress}/balances/`

  return axios.get(url, {
    params: {
      limit: 300,
    },
  })
}

export default fetchTokenBalanceList
