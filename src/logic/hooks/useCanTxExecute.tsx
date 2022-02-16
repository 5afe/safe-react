import { useSelector } from 'react-redux'
import { currentSafe } from '../safe/store/selectors'

type UseCanTxExecuteType = (
  preApprovingOwner?: string,
  txConfirmations?: number,
  existingTxThreshold?: number,
  txNonce?: string,
) => boolean

const useCanTxExecute: UseCanTxExecuteType = (
  preApprovingOwner = '',
  txConfirmations = 0,
  existingTxThreshold,
  txNonce,
) => {
  const safeInfo = useSelector(currentSafe)

  if (txNonce && parseInt(txNonce, 10) !== safeInfo.nonce) {
    return false
  }

  // A tx might have been created with a threshold that is different than the current policy
  // If an existing tx threshold isn't passed, take the current safe threshold
  const threshold = existingTxThreshold ?? safeInfo.threshold

  if (txConfirmations >= threshold) {
    return true
  }

  // When having a preApprovingOwner it is needed one less confirmation to execute the tx
  if (preApprovingOwner) {
    return txConfirmations + 1 === threshold
  }

  return false
}

export default useCanTxExecute
