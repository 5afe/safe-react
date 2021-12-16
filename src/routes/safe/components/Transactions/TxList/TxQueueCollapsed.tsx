import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useAssetInfo } from './hooks/useAssetInfo'
import { useTransactionStatus } from './hooks/useTransactionStatus'
import { useTransactionType } from './hooks/useTransactionType'
import { TxCollapsed } from './TxCollapsed'

export type CalculatedVotes = { votes: string; submitted: number; required: number }

const calculateVotes = (executionInfo: MultisigExecutionInfo): CalculatedVotes | undefined => {
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
}

export const TxQueueCollapsed = ({ isGrouped = false, transaction }: TxQueuedCollapsedProps): ReactElement => {
  const executionInfo = transaction.executionInfo as MultisigExecutionInfo
  const nonce = executionInfo?.nonce
  const type = useTransactionType(transaction)
  const info = useAssetInfo(transaction.txInfo)
  const votes = calculateVotes(executionInfo)
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
      status={status}
    />
  )
}
