import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
import { MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  isStatusCancelled,
  isStatusFailed,
  isStatusSuccess,
  isStatusWillBeReplaced,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { addressInList } from 'src/routes/safe/components/Transactions/TxList/utils'

export type TransactionStatusProps = {
  color: ThemeColors
  text: string
}

export const useTransactionStatus = (transaction: Transaction): TransactionStatusProps => {
  const currentUser = useSelector(userAccountSelector)
  const [status, setStatus] = useState<TransactionStatusProps>({ color: 'primary', text: '' })

  useEffect(() => {
    if (isStatusSuccess(transaction.txStatus)) {
      setStatus({ color: 'primary', text: 'Success' })
    } else if (isStatusFailed(transaction.txStatus)) {
      setStatus({ color: 'error', text: 'Failed' })
    } else if (isStatusCancelled(transaction.txStatus)) {
      setStatus({ color: 'error', text: 'Cancelled' })
    } else if (isStatusWillBeReplaced(transaction.txStatus)) {
      setStatus({ color: 'placeHolder', text: 'Transaction will be replaced' })
    } else {
      // AWAITING_EXECUTION, AWAITING_CONFIRMATIONS, PENDING or PENDING_FAILED
      let text: string
      const signaturePending = addressInList(
        (transaction.executionInfo as MultisigExecutionInfo)?.missingSigners ?? undefined,
      )

      switch (transaction.txStatus) {
        case 'AWAITING_CONFIRMATIONS':
          text = signaturePending(currentUser) ? 'Needs your confirmation' : 'Needs confirmations'
          break
        case 'AWAITING_EXECUTION':
          text = 'Needs execution'
          break
        case 'PENDING':
        case 'PENDING_FAILED':
        default:
          text = 'Pending'
          break
      }

      setStatus({ color: 'rinkeby', text })
    }
  }, [currentUser, transaction.executionInfo, transaction.txStatus])

  return status
}
