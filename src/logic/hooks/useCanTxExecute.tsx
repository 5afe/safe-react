import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { extractSafeAddress } from 'src/routes/routes'
import { sameString } from 'src/utils/strings'
import { currentSafe } from '../safe/store/selectors'
import { nextTransactions } from '../safe/store/selectors/gatewayTransactions'
import useGetRecommendedNonce from './useGetRecommendedNonce'

type UseCanTxExecuteType = (
  threshold: number,
  preApprovingOwner?: string,
  txConfirmations?: number,
  txType?: string,
) => boolean

export const calculateCanTxExecute = (
  currentSafeNonce: number,
  hasQueueNextTx = false,
  preApprovingOwner = '',
  threshold: number,
  txConfirmations = 0,
  txType = '',
  recommendedNonce?: number,
): boolean => {
  // Do not display "Execute checkbox" if there's a tx in the next queue
  if (hasQueueNextTx) return false

  // Single owner Safe AND transaction is the next nonce
  const isSingleOwnerNextTx = threshold === 1 && recommendedNonce === currentSafeNonce

  if (isSingleOwnerNextTx || sameString(txType, 'spendingLimit') || txConfirmations >= threshold) {
    return true
  }

  // When having a preApprovingOwner it is needed one less confirmation to execute the tx
  if (preApprovingOwner && txConfirmations) {
    return txConfirmations + 1 === threshold
  }

  return false
}

// Review default values
const useCanTxExecute: UseCanTxExecuteType = (threshold, preApprovingOwner = '', txConfirmations = 0, txType) => {
  const [canTxExecute, setCanTxExecute] = useState(false)
  const nextQueuedTx = useSelector(nextTransactions)
  const hasQueueNextTx = nextQueuedTx && Object.keys(nextQueuedTx).length > 0

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
      txType,
      recommendedNonce,
    )
    setCanTxExecute(result)
  }, [currentSafeNonce, hasQueueNextTx, preApprovingOwner, recommendedNonce, threshold, txConfirmations, txType])

  return canTxExecute
}

export default useCanTxExecute
