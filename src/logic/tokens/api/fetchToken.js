//
import axios from 'axios'

import { getRelayUrl } from 'config/index'

const fetchToken = (tokenAddress) => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}/tokens/`

  return axios.get(url, {
    params: {
      address: tokenAddress,
    },
  })
}

export default fetchToken
