import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'
import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'

import { Transfer } from 'src/logic/safe/store/models/types/gateway'
import { useAssetInfo } from './hooks/useAssetInfo'

const Block = styled.div`
  display: flex;
  align-items: center;
`

const Amount = styled(Text)`
  margin-left: 10px;
`

export type TokenTransferAmountProps = {
  direction: Transfer['direction']
  transferInfo: Transfer['transferInfo']
  amountWithSymbol: string
}

export const TokenTransferAmount = (props: TokenTransferAmountProps): ReactElement => {
  const assetInfo = useAssetInfo(props)

  return (
    <Block>
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
