import get from 'lodash.get'
import isEqual from 'lodash.isequal'
import memoize from 'lodash.memoize'
import { createSelectorCreator, defaultMemoize } from 'reselect'

export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

// TODO: enhance this approach
// TODO: document
const hashFn = (transactions, { nonce, txLocation }) => {
  const transactionsByLocation = get(transactions, txLocation)

  if (transactionsByLocation) {
    const transactionsByNonce = transactionsByLocation[nonce]
    return `${txLocation}-${nonce}-${transactionsByNonce.reduce((acc, tx) => `${acc}-${JSON.stringify(tx)}`, '')}`
  }

  return
}
export const createDeeplyDeepEqualSelector = createSelectorCreator(memoize as any, hashFn)
