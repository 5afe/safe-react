import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { extractSafeAddress } from 'src/routes/routes'
import { currentSafe } from '../safe/store/selectors'
import useGetRecommendedNonce from './useGetRecommendedNonce'

export const calculateCanTxExecute = (
  currentSafeNonce: number,
  preApprovingOwner: string,
  threshold: number,
  txConfirmations: number,
  recommendedNonce?: number,
  isExecution?: boolean, // when executing from the TxList
): boolean => {
  if (isExecution) return true

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

type UseCanTxExecuteType = (isExecution?: boolean, preApprovingOwner?: string, txConfirmations?: number) => boolean

// Review default values
const useCanTxExecute: UseCanTxExecuteType = (isExecution = false, preApprovingOwner = '', txConfirmations = 0) => {
  const [canTxExecute, setCanTxExecute] = useState(false)
  const { threshold } = useSelector(currentSafe)

  const safeAddress = extractSafeAddress()
  const recommendedNonce = useGetRecommendedNonce(safeAddress) // to be changed. should be txNonce
  const { nonce: currentSafeNonce } = useSelector(currentSafe)

  useEffect(() => {
    const result = calculateCanTxExecute(
      currentSafeNonce,
      preApprovingOwner,
      threshold,
      txConfirmations,
      recommendedNonce,
      isExecution,
    )
    setCanTxExecute(result)
  }, [currentSafeNonce, preApprovingOwner, recommendedNonce, threshold, txConfirmations])

  return canTxExecute
}

export default useCanTxExecute
