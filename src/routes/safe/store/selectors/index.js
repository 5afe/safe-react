// @flow
import { Map, List, Set } from 'immutable'
import { type Match } from 'react-router-dom'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { SAFE_PARAM_ADDRESS } from '~/routes/routes'
import { type Safe } from '~/routes/safe/store/models/safe'
import { safesMapSelector } from '~/routes/safeList/store/selectors'
import { type State as TransactionsState, TRANSACTIONS_REDUCER_ID } from '~/routes/safe/store/reducer/transactions'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'
import { safesListSelector } from '~/routes/safeList/store/selectors/'

export type RouterProps = {
  match: Match,
}

export type SafeProps = {
  safeAddress: string,
}

type TransactionProps = {
  transaction: Transaction,
}

const safePropAddressSelector = (state: GlobalState, props: SafeProps) => props.safeAddress

const transactionsSelector = (state: GlobalState): TransactionsState => state[TRANSACTIONS_REDUCER_ID]

const oneTransactionSelector = (state: GlobalState, props: TransactionProps) => props.transaction

export const safeParamAddressSelector = (state: GlobalState, props: RouterProps) => props.match.params[SAFE_PARAM_ADDRESS] || ''

export const safeTransactionsSelector: Selector<GlobalState, SafeProps, List<Transaction>> = createSelector(
  transactionsSelector,
  safePropAddressSelector,
  (transactions: TransactionsState, address: string): List<Transaction> => {
    if (!transactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return transactions.get(address) || List([])
  },
)

export const confirmationsTransactionSelector: Selector<GlobalState, TransactionProps, number> = createSelector(
  oneTransactionSelector,
  (tx: Transaction) => {
    if (!tx) {
      return 0
    }

    const confirmations: List<Confirmation> = tx.get('confirmations')
    if (!confirmations) {
      return 0
    }

    return confirmations.filter((confirmation: Confirmation) => confirmation.get('type') === 'confirmation').count()
  },
)

export type SafeSelectorProps = Safe | typeof undefined

export const safeSelector: Selector<GlobalState, RouterProps, SafeSelectorProps> = createSelector(
  safesMapSelector,
  safeParamAddressSelector,
  (safes: Map<string, Safe>, address: string) => {
    if (!address) {
      return undefined
    }

    const safe = safes.get(address)

    return safe
  },
)

export const safeActiveTokensSelector: Selector<GlobalState, RouterProps, List<string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.activeTokens
  },
)

export const safeBalancesSelector: Selector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.balances
  },
)

export const getActiveTokensAddressesForAllSafes: Selector<GlobalState, any, Set<string>> = createSelector(
  safesListSelector,
  (safes: List<Safe>) => {
    const addresses = Set().withMutations((set) => {
      safes.forEach((safe: Safe) => {
        safe.activeTokens.forEach((tokenAddress) => {
          set.add(tokenAddress)
        })
      })
    })

    return addresses
  },
)

export default createStructuredSelector<Object, *>({
  safe: safeSelector,
  tokens: safeActiveTokensSelector,
})
