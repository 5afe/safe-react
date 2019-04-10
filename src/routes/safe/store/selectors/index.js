// @flow
import { Map, List } from 'immutable'
import { type Match } from 'react-router-dom'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { SAFE_PARAM_ADDRESS } from '~/routes/routes'
import { type Safe } from '~/routes/safe/store/model/safe'
import { safesMapSelector } from '~/routes/safeList/store/selectors'
import { type State as TransactionsState, TRANSACTIONS_REDUCER_ID } from '~/routes/safe/store/reducer/transactions'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'

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

export const safeTokensSelector: Selector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return Map()
    }

    const tokens = safe.get('tokens')

    return tokens
  },
)

export default createStructuredSelector<Object, *>({
  safe: safeSelector,
  tokens: safeTokensSelector,
})
