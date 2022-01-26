import { useSelector } from 'react-redux'
import { currentSafe } from '../safe/store/selectors'

type UseCanTxExecuteType = (preApprovingOwner?: string, txConfirmations?: number) => boolean

const useCanTxExecute: UseCanTxExecuteType = (preApprovingOwner = '', txConfirmations = 0) => {
  const { threshold } = useSelector(currentSafe)

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
