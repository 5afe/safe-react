import { useSelector } from 'react-redux'
import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { AppReduxState } from 'src/store'
import { selectTxStatus } from 'src/logic/safe/store/selectors/txStatus'
import { useState } from 'react'
import { useDebounce } from './useDebounce'

const useLocalTxStatus = (transaction: Transaction): TransactionStatus => {
  const storedStatus = useSelector((state: AppReduxState) => selectTxStatus(state, transaction))
  const [localStatus, setLocalStatus] = useState(storedStatus)

  useDebounce(() => {
    if (storedStatus) {
      setLocalStatus(storedStatus)
    }
  }, 100)

  return localStatus
}

export default useLocalTxStatus
