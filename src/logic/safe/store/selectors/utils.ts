import hash from 'object-hash'
import isEqual from 'lodash/isEqual'
import memoize from 'lodash/memoize'
import { createSelectorCreator, defaultMemoize } from 'reselect'

import { AppReduxState } from 'src/store'

export const createIsEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

const hashFn = (gatewayTransactions: AppReduxState['gatewayTransactions'], safeAddress: string): string =>
  hash(gatewayTransactions[safeAddress] ?? {})

export const createHashBasedSelector = createSelectorCreator(memoize as any, hashFn)
