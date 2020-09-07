import * as React from 'react'

import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { TokenLogo } from 'src/components/TokenLogo'
import { Token } from 'src/logic/tokens/store/model/token'

type Props = {
  asset: Token
}

const AssetTableCell = (props: Props): React.ReactElement => {
  const { asset } = props

  return (
    <Block justify="left">
      <TokenLogo name={asset.name} logoUri={asset.logoUri} />
      <Paragraph noMargin size="lg" style={{ marginLeft: 10 }}>
        {asset.name}
      </Paragraph>
    </Block>
  )
}

export default AssetTableCell
