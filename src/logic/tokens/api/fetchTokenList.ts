import axios, { AxiosResponse } from 'axios'

import { getRelayUrl } from 'src/config/index'
import { TokenDTO } from './token.dto'

interface Response {
  results: TokenDTO[]
}

const fetchTokenList = (): Promise<AxiosResponse<Response>> => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}tokens/`

  return axios.get<Response>(url, {
    params: {
      limit: 3000,
    },
  })
}

export default fetchTokenList
