import { Icon, IconText, Text } from '@gnosis.pm/safe-react-components'
import { default as MuiIconButton } from '@material-ui/core/IconButton'
import React, { MouseEvent as ReactMouseEvent, ReactElement, useContext } from 'react'
import { TxActions } from 'src/routes/safe/components/GatewayTransactions/QueueTransactions'
import styled from 'styled-components'

import CustomIconText from 'src/components/CustomIconText'
import {
  isCustomTxInfo,
  isMultiSendTxInfo,
  isSettingsChangeTxInfo,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { KNOWN_MODULES } from 'src/utils/constants'
import { AssetInfo, isTokenTransferAsset } from './hooks/useAssetInfo'
import { TransactionActions } from './hooks/useTransactionActions'
import { TransactionStatusProps } from './hooks/useTransactionStatus'
import { TxTypeProps } from './hooks/useTransactionType'
import { StyledGroupedTransactions, StyledTransaction } from './styled'
import { TokenTransferAmount } from './TokenTransferAmount'

const IconButton = styled(MuiIconButton)`
  padding: 8px !important;
`

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

const CollapsedActionButtons = ({
  actions,
  transaction,
}: {
  actions: TransactionActions
  transaction: Transaction
}): ReactElement => {
  const { selectAction } = useContext(TxActions)
  const handleConfirmButtonClick = (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    selectAction?.({ action: actions.canExecute ? 'execute' : 'confirm', transaction })
  }

  const handleCancelButtonClick = (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    selectAction?.({ action: 'cancel', transaction })
  }

  return (
    <>
      {(actions.canConfirm || actions.canExecute) && (
        <IconButton size="small" type="button" onClick={handleConfirmButtonClick}>
          <Icon
            type={actions.canExecute ? 'rocket' : 'check'}
            color="primary"
            size="sm"
            tooltip={actions.canExecute ? 'Execute' : 'Confirm'}
          />
        </IconButton>
      )}
      {actions.canCancel && (
        <IconButton size="small" type="button" onClick={handleCancelButtonClick}>
          <Icon type="circleCross" color="error" size="sm" tooltip="Cancel" />
        </IconButton>
      )}
    </>
  )
}

type TxCollapsedProps = {
  transaction?: Transaction
  isGrouped?: boolean
  nonce?: number
  type: TxTypeProps
  info?: AssetInfo
  time: string
  votes?: string
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
  const TxCollapsedNonce = (
    <div className="tx-nonce">
      <Text size="lg">{nonce}</Text>
    </div>
  )

  const TxCollapsedType = (
    <div className="tx-type">
      <CustomIconText iconUrl={type.icon} text={type.text} />
    </div>
  )

  const TxCollapsedInfo = <div className="tx-info">{info && <TxInfo info={info} />}</div>

  const TxCollapsedTime = (
    <div className="tx-time">
      <Text size="lg">{time}</Text>
    </div>
  )

  const TxCollapsedVotes = (
    <div className="tx-votes">
      {votes && <IconText color="primary" iconType="owners" iconSize="sm" text={`${votes}`} textSize="sm" />}
    </div>
  )

  const TxCollapsedActions = (
    <div className="tx-actions">
      {actions?.isUserAnOwner && transaction && <CollapsedActionButtons transaction={transaction} actions={actions} />}
    </div>
  )

  const TxCollapsedStatus = (
    <div className="tx-status">
      <Text size="lg" color={status.color} className="col" strong>
        {status.text}
      </Text>
    </div>
  )

  return isGrouped ? (
    <StyledGroupedTransactions>
      {/* no nonce */}
      {TxCollapsedType}
      {TxCollapsedInfo}
      {TxCollapsedTime}
      {TxCollapsedVotes}
      {TxCollapsedActions}
      {TxCollapsedStatus}
    </StyledGroupedTransactions>
  ) : (
    <StyledTransaction>
      {TxCollapsedNonce}
      {TxCollapsedType}
      {TxCollapsedInfo}
      {TxCollapsedTime}
      {TxCollapsedVotes}
      {TxCollapsedActions}
      {TxCollapsedStatus}
    </StyledTransaction>
  )
}
