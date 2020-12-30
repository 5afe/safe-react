import { Text } from '@gnosis.pm/safe-react-components'
import React, { FC, HTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import { Transfer } from 'src/logic/safe/store/models/types/gateway'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'
import { useAssetInfo } from 'src/routes/safe/components/GatewayTransactions/Row/hooks/useAssetInfo'

const Amount = styled(Text)`
  margin-left: 10px;
`

export type TokenTransferAmountProps = {
  direction: Transfer['direction']
  transferInfo: Transfer['transferInfo']
  amountWithSymbol: string
}

export const TokenTransferAmount: FC<TokenTransferAmountProps & HTMLAttributes<unknown>> = (props) => {
  const assetInfo = useAssetInfo(props)

  return (
    <Block justify="left">
      <Img
        alt={assetInfo.name}
        height={18}
        onError={(error) => {
          error.currentTarget.onerror = null
          error.currentTarget.src = assetInfo.type === 'ERC721' ? NFTIcon : TokenPlaceholder
        }}
        src={assetInfo.logoUri}
      />
      <Amount size="lg">{assetInfo.amountWithSymbol}</Amount>
    </Block>
  )
}
