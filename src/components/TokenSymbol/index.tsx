import React, { useEffect, useState } from 'react'
import { setImageToPlaceholder } from '../../routes/safe/components/Balances/utils'
import Img from '../layout/Img'
import { getTokenInfos } from '../../logic/tokens/store/actions/fetchTokens'
import { Token } from '../../logic/tokens/store/model/token'

type Props = {
  tokenAddress: string
}

export const TokenSymbol = ({ tokenAddress }: Props): React.ReactElement => {
  const [token, setToken] = useState<Token | null>(null)
  useEffect(() => {
    const fetchTokenInfo = async () => {
      const tokenInfo = await getTokenInfos(tokenAddress)
      setToken(tokenInfo)
    }
    fetchTokenInfo()
  }, [tokenAddress])

  if (!token) return null
  return <Img alt={token.name} height={26} onError={setImageToPlaceholder} src={token.logoUri} />
}
