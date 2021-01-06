import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import CustomIconText from 'src/components/CustomIconText'
import { TransactionStatusProps } from 'src/routes/safe/components/GatewayTransactions/hooks/useTransactionStatus'
import { AssetInfo, isTokenTransferAsset } from './hooks/useAssetInfo'
import { TxTypeProps } from './hooks/useTransactionType'
import { StyledTransaction } from './styled'
import { TokenTransferAmount } from './TokenTransferAmount'

type TxCollapsedProps = {
  nonce?: number
  type: TxTypeProps
  info?: AssetInfo
  time: string
  votes?: string
  actions?: string
  status: TransactionStatusProps
}

export const TxCollapsed = ({ nonce, type, info, time, votes, actions, status }: TxCollapsedProps): ReactElement => {
  return (
    <StyledTransaction>
      <div className="tx-nonce">
        <Text size="lg">{nonce}</Text>
      </div>
      <div className="tx-type">
        <CustomIconText iconUrl={type.icon} text={type.text} />
      </div>
      <div className="tx-info">{info && isTokenTransferAsset(info) && <TokenTransferAmount assetInfo={info} />}</div>
      <div className="tx-time">
        <Text size="lg">{time}</Text>
      </div>
      <div className="tx-votes">{votes}</div>
      <div className="tx-actions">{actions}</div>
      <div className="tx-status">
        <Text size="lg" color={status.color} className="col" strong>
          {status.text}
        </Text>
      </div>
    </StyledTransaction>
  )
}
