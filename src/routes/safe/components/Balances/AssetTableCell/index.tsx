import * as React from 'react'

import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'

const AssetTableCell = (props) => {
  const { asset } = props

  return (
    <Block justify="left">
      <Img alt={asset.name} height={26} onError={setImageToPlaceholder} src={asset.logoUri} />
      <Paragraph noMargin size="lg" style={{ marginLeft: 10 }}>
        {asset.name}
      </Paragraph>
    </Block>
  )
}

export default AssetTableCell
