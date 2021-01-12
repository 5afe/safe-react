import React, { ReactElement } from 'react'
import { Transaction } from 'src/logic/safe/store/models/types/gateway'

import { useAssetInfo } from './hooks/useAssetInfo'
import { useTransactionStatus } from './hooks/useTransactionStatus'
import { useTransactionType } from './hooks/useTransactionType'
import { TxCollapsed, TxCollapsedGrouped } from './TxCollapsed'
import { formatTime } from './utils'

const calculateVotes = (executionInfo: Transaction['executionInfo']): string | undefined => {
  return executionInfo
    ? `${executionInfo.confirmationsSubmitted} out of ${executionInfo.confirmationsRequired}`
    : undefined
}

export const TxQueuedCollapsed = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const nonce = transaction.executionInfo?.nonce
  const type = useTransactionType(transaction)
  const info = useAssetInfo(transaction.txInfo)
  const time = formatTime(transaction.timestamp)
  const votes = calculateVotes(transaction.executionInfo)
  const status = useTransactionStatus(transaction)

  return <TxCollapsed nonce={nonce} type={type} info={info} time={time} votes={votes} status={status} />
}

export const TxQueuedGroupedCollapsed = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const type = useTransactionType(transaction)
  const info = useAssetInfo(transaction.txInfo)
  const time = formatTime(transaction.timestamp)
  const votes = calculateVotes(transaction.executionInfo)
  const status = useTransactionStatus(transaction)

  return <TxCollapsedGrouped type={type} info={info} time={time} votes={votes} status={status} />
}
