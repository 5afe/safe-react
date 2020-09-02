import * as React from 'react'

import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { TokenLogo } from 'src/components/TokenLogo'
import { useToken } from 'src/logic/tokens/hooks/useToken'
import { Token } from 'src/logic/tokens/store/model/token'

type Props = {
  asset: {
    name: string
    address: string
    logoUri: string
  }
}

const AssetTableCell = (props: Props): React.ReactElement => {
  const { asset } = props
  const token = useToken(asset.address) as Token | null

  return (
    <Block justify="left">
      <TokenLogo tokenName={token?.name} tokenLogoUri={token?.logoUri} />
      <Paragraph noMargin size="lg" style={{ marginLeft: 10 }}>
        {asset.name}
      </Paragraph>
    </Block>
  )
}

export default AssetTableCell
