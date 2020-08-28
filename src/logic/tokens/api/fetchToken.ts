import axios from 'axios'

import { getRelayUrl } from 'src/config/index'

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
