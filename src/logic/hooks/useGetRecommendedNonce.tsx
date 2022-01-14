import { SafeTransactionEstimation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getRecommendedNonce } from '../safe/api/fetchSafeTxGasEstimation'
import { getLastTxNonce } from '../safe/store/selectors/gatewayTransactions'

type UseGetRecommendedNonce = (safeAddress: string) => number | undefined

const useGetRecommendedNonce: UseGetRecommendedNonce = (safeAddress) => {
  const lastTxNonce = useSelector(getLastTxNonce)
  const storeNextNonce = lastTxNonce ? lastTxNonce + 1 : undefined

  const [recommendedNonce, setRecommendedNonce] = useState<number | undefined>(storeNextNonce)

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

export default useGetRecommendedNonce
