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
    const fetchRecommendedNonce = async () => {
      try {
        const recommendedNonce = await getRecommendedNonce(safeAddress)
        setRecommendedNonce(recommendedNonce)
      } catch (e) {
        return
      }
    }
    fetchRecommendedNonce()
  }, [lastTxNonce, safeAddress])

  return recommendedNonce
}

export default useGetRecommendedNonce
