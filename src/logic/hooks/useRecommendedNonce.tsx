import { SafeTransactionEstimation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getRecommendedNonce } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { getLastTxNonce } from 'src/logic/safe/store/selectors/gatewayTransactions'

const useRecommendedNonce = (safeAddress: string): number => {
  const lastTxNonce = useSelector(getLastTxNonce)
  const [recommendedNonce, setRecommendedNonce] = useState<number>(lastTxNonce ? lastTxNonce + 1 : 0)

  useEffect(() => {
    let isCurrent = true

    const fetchRecommendedNonce = async () => {
      let recommendedNonce: SafeTransactionEstimation['recommendedNonce']
      try {
        recommendedNonce = await getRecommendedNonce(safeAddress)
      } catch (e) {
        return
      }

      if (isCurrent) {
        setRecommendedNonce(recommendedNonce)
      }
    }
    fetchRecommendedNonce()

    return () => {
      isCurrent = false
    }
  }, [lastTxNonce, safeAddress])

  return recommendedNonce
}

export default useRecommendedNonce
