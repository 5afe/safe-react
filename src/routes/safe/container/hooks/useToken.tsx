import { useEffect, useState } from 'react'
import { Token } from 'src/logic/tokens/store/model/token'
import { getTokenInfos } from 'src/logic/tokens/store/actions/fetchTokens'

export const useToken = (tokenAddress: string): Token | null => {
  const [token, setToken] = useState<Token | null>(null)
  useEffect(() => {
    const fetchTokenInfo = async () => {
      const tokenInfo = await getTokenInfos(tokenAddress)
      setToken(tokenInfo)
    }
    fetchTokenInfo()
  }, [tokenAddress])
  return token
}
