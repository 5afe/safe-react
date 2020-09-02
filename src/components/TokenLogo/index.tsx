import React from 'react'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import Img from 'src/components/layout/Img'

type Props = {
  height?: number
  tokenName: string
  tokenLogoUri?: string
}

export const TokenLogo = ({ tokenName, tokenLogoUri, height = 26 }: Props): React.ReactElement => {
  return <Img alt={tokenName} height={height} onError={setImageToPlaceholder} src={tokenLogoUri} />
}
