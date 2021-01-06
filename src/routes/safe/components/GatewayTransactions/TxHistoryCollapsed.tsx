import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { formatTime } from 'src/routes/safe/components/GatewayTransactions/utils'
import { useAssetInfo } from './hooks/useAssetInfo'
import { useTransactionStatus } from './hooks/useTransactionStatus'
import { useTransactionType } from './hooks/useTransactionType'
import { TxCollapsed } from './TxCollapsed'

export const TxHistoryCollapsed = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const nonce = transaction.executionInfo?.nonce
  const type = useTransactionType(transaction)
  const info = useAssetInfo(transaction.txInfo)
  const time = formatTime(transaction.timestamp)
  const status = useTransactionStatus(transaction.txStatus)

  return <TxCollapsed nonce={nonce} type={type} info={info} time={time} status={status} />
}
