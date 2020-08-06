import axios from 'axios'

import { getRelayUrl } from 'src/config/index'
import { TokenDTO } from './token.dto'

const fetchToken = async (tokenAddress: string): Promise<TokenDTO | null> => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}tokens/${tokenAddress}`

  try {
    const result = await axios.get<TokenDTO>(url)
    return result.data
  } catch (error) {
    console.error(`Fetching token data for address: ${tokenAddress} errored`, error)
  }
  return null
}

export default fetchToken
