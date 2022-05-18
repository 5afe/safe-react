import { useSelector } from 'react-redux'
import { getRecommendedNonce } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { getLastTxNonce } from 'src/logic/safe/store/selectors/gatewayTransactions'
import useAsync from 'src/logic/hooks/useAsync'

const useRecommendedNonce = (safeAddress: string): number => {
  const lastTxNonce = useSelector(getLastTxNonce) || -1

  const [result] = useAsync<number>(() => {
    return getRecommendedNonce(safeAddress)
  }, [safeAddress])

  return result == null ? lastTxNonce + 1 : result
}

export default useRecommendedNonce
