import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
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
import { addressInList } from 'src/routes/safe/components/Transactions/GatewayTransactions/utils'

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
      const signaturePending = addressInList(transaction.executionInfo?.missingSigners)

      switch (transaction.txStatus) {
        case 'AWAITING_CONFIRMATIONS':
          text = signaturePending(currentUser) ? 'Awaiting your confirmation' : 'Awaiting confirmations'
          break
        case 'AWAITING_EXECUTION':
          text = 'Awaiting execution'
          break
        case 'PENDING':
        case 'PENDING_FAILED':
        default:
          text = 'Pending'
          break
      }

      setStatus({ color: 'rinkeby', text })
    }
  }, [currentUser, transaction.executionInfo?.missingSigners, transaction.txStatus])

  return status
}
