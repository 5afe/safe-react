import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { extractSafeAddress } from 'src/routes/routes'
import { currentSafe } from '../safe/store/selectors'
import { nextTransactions } from '../safe/store/selectors/gatewayTransactions'
import useGetRecommendedNonce from './useGetRecommendedNonce'

export const calculateCanTxExecute = (
  currentSafeNonce: number,
  hasQueueNextTx = false,
  preApprovingOwner: string,
  threshold: number,
  txConfirmations: number,
  recommendedNonce?: number,
): boolean => {
  // Do not display "Execute checkbox" if there's a tx in the next queue
  if (hasQueueNextTx) return false

  const isNextTx = recommendedNonce === currentSafeNonce
  // Single owner
  if (threshold === 1) {
    // transaction is the next nonce
    return isNextTx
  }

  if (txConfirmations >= threshold) {
    return true
  }

  // When having a preApprovingOwner it is needed one less confirmation to execute the tx
  if (preApprovingOwner && txConfirmations) {
    return txConfirmations + 1 === threshold
  }

  return false
}

type UseCanTxExecuteType = (preApprovingOwner?: string, txConfirmations?: number) => boolean

// Review default values
const useCanTxExecute: UseCanTxExecuteType = (preApprovingOwner = '', txConfirmations = 0) => {
  const [canTxExecute, setCanTxExecute] = useState(false)
  const nextQueuedTx = useSelector(nextTransactions)
  const hasQueueNextTx = nextQueuedTx && Object.keys(nextQueuedTx).length > 0
  const { threshold } = useSelector(currentSafe)

  const safeAddress = extractSafeAddress()
  const recommendedNonce = useGetRecommendedNonce(safeAddress) // to be changed. should be txNonce
  const { nonce: currentSafeNonce } = useSelector(currentSafe)

  useEffect(() => {
    const result = calculateCanTxExecute(
      currentSafeNonce,
      hasQueueNextTx,
      preApprovingOwner,
      threshold,
      txConfirmations,
      recommendedNonce,
    )
    setCanTxExecute(result)
  }, [currentSafeNonce, hasQueueNextTx, preApprovingOwner, recommendedNonce, threshold, txConfirmations])

  return canTxExecute
}

export default useCanTxExecute
