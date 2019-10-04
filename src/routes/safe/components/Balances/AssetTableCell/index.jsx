// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'

type Props = {
  asset: {
    logoUri: string,
    name: string,
  },
}

const AssetTableCell = (props: Props) => {
  const { asset } = props

  return (
    <Block justify="left">
      <Img src={asset.logoUri} height={26} alt={asset.name} onError={setImageToPlaceholder} />
      <Paragraph size="lg" style={{ marginLeft: 10 }} noMargin>{asset.name}</Paragraph>
    </Block>
  )
}

export default AssetTableCell
