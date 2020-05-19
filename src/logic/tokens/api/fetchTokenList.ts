import axios from 'axios'

import { getRelayUrl } from 'src/config/index'

const fetchTokenList = () => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}tokens/`

  return axios.get(url, {
    params: {
      limit: 3000,
    },
  })
}

export default fetchTokenList
