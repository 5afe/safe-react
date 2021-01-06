import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'
import { TokenTransferAsset } from './hooks/useAssetInfo'

const Amount = styled(Text)`
  margin-left: 10px;
`

const AmountWrapper = styled.div`
  display: flex;
`

export type TokenTransferAmountProps = {
  assetInfo: TokenTransferAsset
}

export const TokenTransferAmount = ({ assetInfo }: TokenTransferAmountProps): ReactElement => {
  return (
    <AmountWrapper>
      <Img
        alt={assetInfo.name}
        height={18}
        onError={(error) => {
          error.currentTarget.onerror = null
          error.currentTarget.src = assetInfo.tokenType === 'ERC721' ? NFTIcon : TokenPlaceholder
        }}
        src={assetInfo.logoUri}
      />
      <Amount size="lg">{`${assetInfo.directionSign}${assetInfo.amountWithSymbol}`}</Amount>
    </AmountWrapper>
  )
}
