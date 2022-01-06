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

// Review default values
const useCanTxExecute: UseCanTxExecuteType = (threshold, preApprovingOwner = '', txConfirmations = 0, txType) => {
  const nextQueuedTx = useSelector(nextTransactions)
  const hasQueueNextTx = nextQueuedTx && Object.keys(nextQueuedTx).length > 0

  const safeAddress = extractSafeAddress()
  const recommendedNonce = useGetRecommendedNonce(safeAddress)
  const { nonce: currentSafeNonce } = useSelector(currentSafe)

  // Do not display "Execute checkbox" if there's a tx in the next queue
  if (hasQueueNextTx) return false

  // Single owner Safe and transaction is the next nonce
  const isSingleOwnerNextTx = threshold === 1 && recommendedNonce === currentSafeNonce

  if (
    isSingleOwnerNextTx ||
    sameString(txType, 'spendingLimit') ||
    (txConfirmations !== undefined && txConfirmations >= threshold)
  ) {
    return true
  }

  if (preApprovingOwner && txConfirmations) {
    return txConfirmations + 1 === threshold
  }

  return false
}

export default useCanTxExecute
