import { useSelector } from 'react-redux'
import { nextTransactions, queuedTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'

const useLastQueuedTxNonce = (): number | undefined => {
  const queuedTxs = useSelector(queuedTransactions)
  const nextTxs = useSelector(nextTransactions)
  const queuedNonces = queuedTxs && Object.keys(queuedTxs)
  const nextNonces = nextTxs && Object.keys(nextTxs)

  if (queuedNonces?.length) {
    return Number(queuedNonces[queuedNonces.length - 1])
  }
  if (nextNonces?.length) {
    return Number(nextNonces[nextNonces.length - 1])
  }
  return undefined
}

export default useLastQueuedTxNonce
