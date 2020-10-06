import axios from 'axios'

import { getTxServiceUrl } from 'src/config/index'

const fetchTokenList = () => {
  const apiUrl = getTxServiceUrl()

  const url = `${apiUrl}tokens/`

  return axios.get(url, {
    params: {
      limit: 3000,
    },
  })
}

export default fetchTokenList
