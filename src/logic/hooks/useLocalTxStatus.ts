import { useSelector } from 'react-redux'
import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { AppReduxState } from 'src/store'
import { selectTxStatus } from 'src/logic/safe/store/selectors/txStatus'

const useLocalTxStatus = (transaction: Transaction): TransactionStatus => {
  return useSelector((state: AppReduxState) => selectTxStatus(state, transaction))
}

export default useLocalTxStatus
