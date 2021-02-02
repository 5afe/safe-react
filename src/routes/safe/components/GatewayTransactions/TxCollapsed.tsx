import { Dot, IconText, Text } from '@gnosis.pm/safe-react-components'
import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
import CircularProgress from '@material-ui/core/CircularProgress'
import React, { ReactElement } from 'react'

import CustomIconText from 'src/components/CustomIconText'
import {
  isCustomTxInfo,
  isMultiSendTxInfo,
  isSettingsChangeTxInfo,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { TxCollapsedActions } from 'src/routes/safe/components/GatewayTransactions/TxCollapsedActions'
import { KNOWN_MODULES } from 'src/utils/constants'
import styled from 'styled-components'
import { AssetInfo, isTokenTransferAsset } from './hooks/useAssetInfo'
import { TransactionActions } from './hooks/useTransactionActions'
import { TransactionStatusProps } from './hooks/useTransactionStatus'
import { TxTypeProps } from './hooks/useTransactionType'
import { StyledGroupedTransactions, StyledTransaction } from './styled'
import { TokenTransferAmount } from './TokenTransferAmount'
import { CalculatedVotes } from './TxQueueCollapsed'

const TxInfo = ({ info }: { info: AssetInfo }) => {
  if (isTokenTransferAsset(info)) {
    return <TokenTransferAmount assetInfo={info} />
  }

  if (isSettingsChangeTxInfo(info)) {
    const UNKNOWN_MODULE = 'Unknown module'

    switch (info.settingsInfo?.type) {
      case 'SET_FALLBACK_HANDLER':
      case 'ADD_OWNER':
      case 'REMOVE_OWNER':
      case 'SWAP_OWNER':
      case 'CHANGE_THRESHOLD':
      case 'CHANGE_IMPLEMENTATION':
        break
      case 'ENABLE_MODULE':
      case 'DISABLE_MODULE':
        return <span>{KNOWN_MODULES[info.settingsInfo.module] ?? UNKNOWN_MODULE}</span>
    }
  }

  if (isCustomTxInfo(info)) {
    if (isMultiSendTxInfo(info)) {
      return (
        <span>
          {info.actionCount} {`action${info.actionCount > 1 ? 's' : ''}`}
        </span>
      )
    }

    return <span>{info.methodName}</span>
  }
  return null
}

const CircularProgressPainter = styled.div<{ color: ThemeColors }>`
  color: ${({ theme, color }) => theme.colors[color]};
`

const SmallDot = styled(Dot)`
  height: 8px;
  width: 8px;
  background-color: ${({ theme, color }) => theme.colors[color]} !important;
`

type TxCollapsedProps = {
  transaction?: Transaction
  isGrouped?: boolean
  nonce?: number
  type: TxTypeProps
  info?: AssetInfo
  time: string
  votes?: CalculatedVotes
  actions?: TransactionActions
  status: TransactionStatusProps
}

export const TxCollapsed = ({
  transaction,
  isGrouped = false,
  nonce,
  type,
  info,
  time,
  votes,
  actions,
  status,
}: TxCollapsedProps): ReactElement => {
  const willBeReplaced = transaction?.txStatus === 'WILL_BE_REPLACED' ? ' will-be-replaced' : ''

  const txCollapsedNonce = (
    <div className={'tx-nonce' + willBeReplaced}>
      <Text size="lg">{nonce}</Text>
    </div>
  )

  const txCollapsedType = (
    <div className={'tx-type' + willBeReplaced}>
      <CustomIconText iconUrl={type.icon} text={type.text} />
    </div>
  )

  const txCollapsedInfo = <div className={'tx-info' + willBeReplaced}>{info && <TxInfo info={info} />}</div>

  const txCollapsedTime = (
    <div className={'tx-time' + willBeReplaced}>
      <Text size="lg">{time}</Text>
    </div>
  )

  const txCollapsedVotes = (
    <div className={'tx-votes' + willBeReplaced}>
      {votes && (
        <IconText
          color={votes.required > votes.submitted ? 'secondaryLight' : 'primary'}
          iconType="owners"
          iconSize="sm"
          text={`${votes.votes}`}
          textSize="sm"
        />
      )}
    </div>
  )

  const txCollapsedActions = (
    <div className={'tx-actions' + willBeReplaced}>
      {actions?.isUserAnOwner && transaction && <TxCollapsedActions transaction={transaction} />}
    </div>
  )

  const txCollapsedStatus = (
    <div className="tx-status">
      {transaction?.txStatus === 'PENDING' || transaction?.txStatus === 'PENDING_FAILED' ? (
        <CircularProgressPainter color={status.color}>
          <CircularProgress size={14} color="inherit" />
        </CircularProgressPainter>
      ) : (
        (transaction?.txStatus === 'AWAITING_EXECUTION' || transaction?.txStatus === 'AWAITING_CONFIRMATIONS') && (
          <SmallDot color={status.color} />
        )
      )}
      <Text size="lg" color={status.color} className="col" strong>
        {status.text}
      </Text>
    </div>
  )

  return isGrouped ? (
    <StyledGroupedTransactions>
      {/* no nonce */}
      {txCollapsedType}
      {txCollapsedInfo}
      {txCollapsedTime}
      {txCollapsedVotes}
      {txCollapsedActions}
      {txCollapsedStatus}
    </StyledGroupedTransactions>
  ) : (
    <StyledTransaction>
      {txCollapsedNonce}
      {txCollapsedType}
      {txCollapsedInfo}
      {txCollapsedTime}
      {txCollapsedVotes}
      {txCollapsedActions}
      {txCollapsedStatus}
    </StyledTransaction>
  )
}
