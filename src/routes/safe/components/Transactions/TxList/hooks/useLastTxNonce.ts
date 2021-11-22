import { useSelector } from 'react-redux'
import { queuedTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'

const useLastTxNonce = (): number | undefined => {
  const queuedTxs = useSelector(queuedTransactions)
  const nonces = queuedTxs && Object.keys(queuedTxs)

  const lastTxNonce = nonces?.length ? Number(nonces[nonces.length - 1]) : undefined

  return lastTxNonce
}

export default useLastTxNonce
