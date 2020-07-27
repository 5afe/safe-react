import * as React from 'react'

import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { TokenSymbol } from '../../../../../components/TokenSymbol'

type Props = {
  asset: {
    name: string
    address: string
    logoUri: string
  }
}

const AssetTableCell = (props: Props): React.ReactElement => {
  const { asset } = props

  return (
    <Block justify="left">
      <TokenSymbol tokenAddress={asset.address} />
      <Paragraph noMargin size="lg" style={{ marginLeft: 10 }}>
        {asset.name}
      </Paragraph>
    </Block>
  )
}

export default AssetTableCell
