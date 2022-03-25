import { Text } from '@gnosis.pm/safe-react-components'
import { TokenType } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'
import { TokenTransferAsset } from 'src/routes/safe/components/Transactions/TxList/utils'

const Amount = styled(Text)`
  margin-left: 10px;
  line-height: 16px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AmountWrapper = styled.div`
  display: flex;
  align-items: center;
`

export type TokenTransferAmountProps = {
  assetInfo: TokenTransferAsset
}

export const TokenTransferAmount = ({ assetInfo }: TokenTransferAmountProps): ReactElement => {
  return (
    <AmountWrapper>
      <Img
        alt={assetInfo.name}
        height={26}
        onError={(error) => {
          error.currentTarget.onerror = null
          error.currentTarget.src = assetInfo.tokenType === TokenType.ERC721 ? NFTIcon : TokenPlaceholder
        }}
        src={assetInfo.logoUri}
      />
      <Amount size="xl">{`${assetInfo.directionSign}${assetInfo.amountWithSymbol}`}</Amount>
    </AmountWrapper>
  )
}
