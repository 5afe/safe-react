import { ReactElement } from 'react'
import { ExplorerButton } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { getExplorerInfo } from 'src/config'
import { BalanceData } from '../dataFetcher'
import { getNativeCurrencyAddress } from 'src/config/utils'

const StyledParagraph = styled(Paragraph)`
  margin-left: 10px;
  margin-right: 10px;
`

const AssetTableCell = ({ asset }: { asset: BalanceData['asset'] }): ReactElement => {
  const isNativeCurrency = asset.address === getNativeCurrencyAddress()
  return (
    <Block justify="left">
      <Img alt={asset.name} height={26} onError={setImageToPlaceholder} src={asset.logoUri} />
      <StyledParagraph noMargin size="lg">
        {asset.name}
      </StyledParagraph>
      {!isNativeCurrency && <ExplorerButton explorerUrl={getExplorerInfo(asset.address)} />}
    </Block>
  )
}

export default AssetTableCell
