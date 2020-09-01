import React from 'react'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import Img from 'src/components/layout/Img'
import { useToken } from 'src/logic/tokens/hooks/useToken'

type Props = {
  tokenAddress: string
  height?: number
}

export const TokenSymbol = ({ tokenAddress, height = 26 }: Props): React.ReactElement => {
  const token = useToken(tokenAddress)
  if (!token) return null
  const imgUrl = 'image' in token ? token.image : token.logoUri
  return <Img alt={token.name} height={height} onError={setImageToPlaceholder} src={imgUrl} />
}
