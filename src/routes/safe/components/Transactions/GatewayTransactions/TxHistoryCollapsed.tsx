import React, { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useAssetInfo } from './hooks/useAssetInfo'
import { useTransactionStatus } from './hooks/useTransactionStatus'
import { useTransactionType } from './hooks/useTransactionType'
import { TxCollapsed } from './TxCollapsed'

export const TxHistoryCollapsed = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const nonce = transaction.executionInfo?.nonce
  const type = useTransactionType(transaction)
  const info = useAssetInfo(transaction.txInfo)
  const status = useTransactionStatus(transaction)

  return <TxCollapsed nonce={nonce} type={type} info={info} time={transaction.timestamp} status={status} />
}
