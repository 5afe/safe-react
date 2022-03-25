import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, useMemo } from 'react'

import useTxStatus from 'src/logic/hooks/useTxStatus'
import { LocalTransactionStatus, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { getAssetInfo } from 'src/routes/safe/components/Transactions/TxList/utils'
import { useTransactionStatus } from './hooks/useTransactionStatus'
import { useTransactionType } from './hooks/useTransactionType'
import { TxCollapsed } from './TxCollapsed'

export type CalculatedVotes = { votes: string; submitted: number; required: number }

const calculateVotes = (executionInfo: MultisigExecutionInfo, isPending: boolean): CalculatedVotes | undefined => {
  if (!executionInfo) return

  const submitted = executionInfo.confirmationsSubmitted
  const required = executionInfo.confirmationsRequired

  if (isPending && submitted < required) return

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
  const info = useMemo(() => getAssetInfo(transaction.txInfo), [transaction.txInfo])
  const status = useTransactionStatus(transaction)
  const txStatus = useTxStatus(transaction)
  const isPending = txStatus === LocalTransactionStatus.PENDING
  const votes = calculateVotes(executionInfo, isPending)

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
