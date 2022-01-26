import { useSelector } from 'react-redux'
import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { AppReduxState } from 'src/store'
import { selectTxStatus } from 'src/logic/safe/store/selectors/pendingTransactions'
import { useState } from 'react'
import { useDebounce } from './useDebounce'

// Takes into account whether a transaction is pending or not
const useTxStatus = (transaction: Transaction): TransactionStatus => {
  const storedStatus = useSelector((state: AppReduxState) => selectTxStatus(state, transaction))
  const [localStatus, setLocalStatus] = useState(storedStatus)

  useDebounce(() => {
    if (storedStatus) {
      setLocalStatus(storedStatus)
    }
  }, 100)

  return localStatus
}

export default useTxStatus
