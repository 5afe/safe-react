import axios from 'axios'

import { getRelayUrl } from 'src/config/index'

type TokenData = {
  type: string
  address: string
  name: string
  symbol: string
  decimals: number
  logoUri: string
}

const fetchToken = async (tokenAddress: string): Promise<TokenData | null> => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}tokens/${tokenAddress}`

  try {
    const result = await axios.get<TokenData>(url)
    return result.data
  } catch (error) {
    console.error(`Fetching token data for address: ${tokenAddress} errored`, error)
  }
  return null
}

export default fetchToken
