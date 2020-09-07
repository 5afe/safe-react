import React from 'react'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import Img from 'src/components/layout/Img'

type Props = {
  height?: number
  name: string
  logoUri: string
}

export const TokenLogo = ({ name, logoUri, height = 26 }: Props): React.ReactElement => {
  return <Img alt={name} height={height} onError={setImageToPlaceholder} src={logoUri} />
}
