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
  manualSafeNonce?: number,
): boolean => {
  if (isExecution) return true

  // Single owner
  if (threshold === 1) {
    // nonce was changed manually to be executed
    if (manualSafeNonce) {
      return manualSafeNonce === currentSafeNonce
    }
    // is next tx
    return recommendedNonce === currentSafeNonce
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

type UseCanTxExecuteType = (
  isExecution?: boolean,
  manualSafeNonce?: number,
  preApprovingOwner?: string,
  txConfirmations?: number,
) => boolean

const useCanTxExecute: UseCanTxExecuteType = (
  isExecution = false,
  manualSafeNonce,
  preApprovingOwner = '',
  txConfirmations = 0,
) => {
  const { threshold } = useSelector(currentSafe)

  const safeAddress = extractSafeAddress()
  const recommendedNonce = useGetRecommendedNonce(safeAddress)
  const { nonce: currentSafeNonce } = useSelector(currentSafe)

  return calculateCanTxExecute(
    currentSafeNonce,
    preApprovingOwner,
    threshold,
    txConfirmations,
    recommendedNonce,
    isExecution,
    manualSafeNonce,
  )
}

export default useCanTxExecute
