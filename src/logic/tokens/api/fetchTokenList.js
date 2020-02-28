// @flow
import axios from 'axios'

import { getRelayUrl } from '~/config/index'

const fetchTokenList = () => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}tokens/`

  return axios.get(url, {
    params: {
      limit: 300,
    },
  })
}

export default fetchTokenList
