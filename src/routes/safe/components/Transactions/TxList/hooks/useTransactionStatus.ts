import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
import { MultisigExecutionInfo, TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { selectTxStatus } from 'src/logic/safe/store/selectors/txStatus'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { addressInList } from 'src/routes/safe/components/Transactions/TxList/utils'
import { AppReduxState } from 'src/store'

export type TransactionStatusProps = {
  color: ThemeColors
  text: string
}

export const useTransactionStatus = (transaction: Transaction): TransactionStatusProps => {
  const currentUser = useSelector(userAccountSelector)
  const [status, setStatus] = useState<TransactionStatusProps>({ color: 'primary', text: '' })
  const txStatus = useSelector((state: AppReduxState) => selectTxStatus(state, transaction))
  const { executionInfo } = transaction

  useEffect(() => {
    switch (txStatus) {
      case TransactionStatus.SUCCESS:
        setStatus({ color: 'primary', text: 'Success' })
        break
      case TransactionStatus.FAILED:
        setStatus({ color: 'error', text: 'Failed' })
        break
      case TransactionStatus.CANCELLED:
        setStatus({ color: 'error', text: 'Cancelled' })
        break
      case TransactionStatus.WILL_BE_REPLACED:
        setStatus({ color: 'placeHolder', text: 'Transaction will be replaced' })
        break
      case TransactionStatus.AWAITING_CONFIRMATIONS:
        const signaturePending = addressInList((executionInfo as MultisigExecutionInfo)?.missingSigners ?? undefined)
        const text = signaturePending(currentUser) ? 'Needs your confirmation' : 'Needs confirmations'
        setStatus({ color: 'rinkeby', text })
        break
      case TransactionStatus.AWAITING_EXECUTION:
        setStatus({ color: 'rinkeby', text: 'Needs execution' })
        break
      case TransactionStatus.PENDING:
        setStatus({ color: 'rinkeby', text: 'Pending' })
        break
      case TransactionStatus.PENDING_FAILED:
        setStatus({ color: 'rinkeby', text: 'Execution failed' })
        break
    }
  }, [setStatus, txStatus, currentUser, executionInfo])

  return status
}
