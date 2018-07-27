// @flow
import { List, Map } from 'immutable'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'
import { makeProvider } from '~/wallets/store/model/provider'
import { makeConfirmation, type Confirmation } from '~/routes/safe/store/model/confirmation'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { makeTransaction, type Transaction } from '~/routes/safe/store/model/transaction'

const grantedSelectorTests = () => {
  describe('Safe Selector[safeTransactionsSelector]', () => {
    it('should return empty list if no transactions in store', () => {
      // GIVEN
      const reduxStore = {
        [SAFE_REDUCER_ID]: Map(),
        providers: makeProvider(),
        tokens: undefined,
        transactions: Map(),
      }

      // WHEN
      const transactions = safeTransactionsSelector(reduxStore, { safeAddress: 'fooAddress' })

      // THEN
      expect(transactions).toEqual(List([]))
    })

    it('should return empty list if transactions in store but not safe address in props', () => {
      // GIVEN
      const firstConfirmation: Confirmation = makeConfirmation({
        owner: makeOwner(),
        status: true,
        hash: 'asdf',
      })

      const transaction: Transaction = makeTransaction({
        name: 'Buy batteries',
        nonce: 1,
        value: 2,
        confirmations: List([firstConfirmation]),
        destination: 'destAddress',
        threshold: 2,
        tx: '',
      })

      const reduxStore = {
        [SAFE_REDUCER_ID]: Map(),
        providers: makeProvider(),
        tokens: undefined,
        transactions: Map({ fooAddress: List([transaction]) }),
      }

      // WHEN
      const transactionsEmpty = safeTransactionsSelector(reduxStore, { safeAddress: '' })
      // $FlowFixMe
      const transactionsUndefined = safeTransactionsSelector(reduxStore, { safeAddress: undefined })

      // THEN
      expect(transactionsEmpty).toEqual(List([]))
      expect(transactionsUndefined).toEqual(List([]))
    })

    it('should return empty list if there are transactions belonging to different address', () => {
      // GIVEN
      const firstConfirmation: Confirmation = makeConfirmation({
        owner: makeOwner(),
        status: true,
        hash: 'asdf',
      })

      const transaction: Transaction = makeTransaction({
        name: 'Buy batteries',
        nonce: 1,
        value: 2,
        confirmations: List([firstConfirmation]),
        destination: 'destAddress',
        threshold: 2,
        tx: '',
      })

      const reduxStore = {
        [SAFE_REDUCER_ID]: Map(),
        providers: makeProvider(),
        tokens: undefined,
        transactions: Map({ fooAddress: List([transaction]) }),
      }

      // WHEN
      const transactions = safeTransactionsSelector(reduxStore, { safeAddress: 'invented' })

      // THEN
      expect(transactions).toEqual(List([]))
    })

    it('should return transactions of safe', () => {
      // GIVEN
      const firstConfirmation: Confirmation = makeConfirmation({
        owner: makeOwner(),
        status: true,
        hash: 'asdf',
      })

      const transaction: Transaction = makeTransaction({
        name: 'Buy batteries',
        nonce: 1,
        value: 2,
        confirmations: List([firstConfirmation]),
        destination: 'destAddress',
        threshold: 2,
        tx: '',
      })

      const reduxStore = {
        [SAFE_REDUCER_ID]: Map(),
        providers: makeProvider(),
        tokens: undefined,
        transactions: Map({ fooAddress: List([transaction]) }),
      }

      // WHEN
      const transactions = safeTransactionsSelector(reduxStore, { safeAddress: 'fooAddress' })

      // THEN
      expect(transactions).toEqual(List([transaction]))
    })
  })
}

export default grantedSelectorTests
