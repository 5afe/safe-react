import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useAssetInfo } from './hooks/useAssetInfo'
import { TransactionActions } from './hooks/useTransactionActions'
import { useTransactionStatus } from './hooks/useTransactionStatus'
import { useTransactionType } from './hooks/useTransactionType'
import { TxCollapsed } from './TxCollapsed'

export type CalculatedVotes = { votes: string; submitted: number; required: number }

const calculateVotes = (executionInfo: Transaction['executionInfo']): CalculatedVotes | undefined => {
  if (!executionInfo) {
    return
  }

  const submitted = executionInfo.confirmationsSubmitted
  const required = executionInfo.confirmationsRequired

  return {
    votes: `${submitted} out of ${required}`,
    submitted,
    required,
  }
}

type TxQueuedCollapsedProps = {
  isGrouped?: boolean
  transaction: Transaction
  actions?: TransactionActions
}

export const TxQueueCollapsed = ({ isGrouped = false, transaction, actions }: TxQueuedCollapsedProps): ReactElement => {
  const nonce = transaction.executionInfo?.nonce
  const type = useTransactionType(transaction)
  const info = useAssetInfo(transaction.txInfo)
  const votes = calculateVotes(transaction.executionInfo)
  const status = useTransactionStatus(transaction)

  return (
    <TxCollapsed
      transaction={transaction}
      isGrouped={isGrouped}
      nonce={nonce}
      type={type}
      info={info}
      time={transaction.timestamp}
      votes={votes}
      actions={actions}
      status={status}
    />
  )
}
