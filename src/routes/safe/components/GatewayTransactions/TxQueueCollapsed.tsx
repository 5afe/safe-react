import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useAssetInfo } from './hooks/useAssetInfo'
import { useTransactionActions } from './hooks/useTransactionActions'
import { useTransactionStatus } from './hooks/useTransactionStatus'
import { useTransactionType } from './hooks/useTransactionType'
import { TxCollapsed } from './TxCollapsed'
import { formatTime } from './utils'

const calculateVotes = (executionInfo: Transaction['executionInfo']): string | undefined => {
  return executionInfo
    ? `${executionInfo.confirmationsSubmitted} out of ${executionInfo.confirmationsRequired}`
    : undefined
}

type TxQueuedCollapsedProps = {
  isGrouped?: boolean
  transaction: Transaction
}

export const TxQueueCollapsed = ({ isGrouped = false, transaction }: TxQueuedCollapsedProps): ReactElement => {
  const nonce = transaction.executionInfo?.nonce
  const type = useTransactionType(transaction)
  const info = useAssetInfo(transaction.txInfo)
  const time = formatTime(transaction.timestamp)
  const votes = calculateVotes(transaction.executionInfo)
  const actions = useTransactionActions(transaction)
  const status = useTransactionStatus(transaction)

  return (
    <TxCollapsed
      transaction={transaction}
      isGrouped={isGrouped}
      nonce={nonce}
      type={type}
      info={info}
      time={time}
      votes={votes}
      actions={actions}
      status={status}
    />
  )
}
