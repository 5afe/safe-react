import { Text } from '@gnosis.pm/safe-react-components'
import React, { FC, HTMLAttributes } from 'react'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import { Transfer } from 'src/logic/safe/store/models/types/gateway'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'
import { useAssetInfo } from 'src/routes/safe/components/GatewayTransactions/Collapsed/hooks/useAssetInfo'

const Amount = styled(Text)`
  margin-left: 10px;
`

export type TokenTransferAmountProps = {
  txInfo: Transfer
}

export const TokenTransferAmount: FC<TokenTransferAmountProps & HTMLAttributes<unknown>> = ({ txInfo }) => {
  const assetInfo = useAssetInfo(txInfo)

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
      <Amount size="lg">{`${assetInfo.directionSign}${assetInfo.amountWithSymbol}`}</Amount>
    </Block>
  )
}
