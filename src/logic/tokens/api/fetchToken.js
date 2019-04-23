// @flow
import axios from 'axios'
import { getRelayUrl } from '~/config/index'

const fetchToken = (tokenAddress: string) => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}/tokens/${tokenAddress}`

  return axios.get(url)
}

export default fetchToken