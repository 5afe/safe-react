// @flow
import axios from 'axios'

import { getRelayUrl } from '~/config/index'

const fetchToken = (tokenAddress: string) => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}/tokens/`

  return axios.get(url, {
    params: {
      address: tokenAddress,
    },
  })
}

export default fetchToken
