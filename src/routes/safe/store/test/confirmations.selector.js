// @flow
import { List, Map } from 'immutable'
import { makeTransaction, type Transaction } from '~/routes/safe/store/model/transaction'
import { type Confirmation, makeConfirmation } from '~/routes/safe/store/model/confirmation'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { confirmationsTransactionSelector } from '~/routes/safe/store/selectors/index'
import { makeProvider } from '~/wallets/store/model/provider'

const grantedSelectorTests = () => {
  describe('Safe Selector[confirmationsTransactionSelector]', () => {
    it('returns 1 confirmation if safe has only one owner when tx is created', () => {
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
        safes: Map(),
        providers: makeProvider(),
        balances: Map(),
        transactions: Map(),
      }

      // WHEN
      const threshold = confirmationsTransactionSelector(reduxStore, { transaction })

      // THEN
      expect(threshold).toBe(1)
    })

    it('returns 1 confirmation if safe has two or more owners when multisig tx is created', () => {
      // GIVEN
      const firstConfirmation: Confirmation = makeConfirmation({
        owner: makeOwner(),
        status: true,
        hash: 'asdf',
      })

      const secondConfirmation: Confirmation = makeConfirmation({
        owner: makeOwner(),
        status: false,
        hash: '',
      })

      const transaction: Transaction = makeTransaction({
        name: 'Buy batteries',
        nonce: 1,
        value: 2,
        confirmations: List([firstConfirmation, secondConfirmation]),
        destination: 'destAddress',
        threshold: 2,
        tx: '',
      })

      const reduxStore = {
        safes: Map(),
        providers: makeProvider(),
        balances: Map(),
        transactions: Map(),
      }

      // WHEN
      const threshold = confirmationsTransactionSelector(reduxStore, { transaction })

      // THEN
      expect(threshold).toBe(1)
    })

    it('should return 0 confirmations if not transaction is sent as prop to component', () => {
      const reduxStore = {
        safes: Map(),
        providers: makeProvider(),
        balances: Map(),
        transactions: Map(),
      }

      // WHEN
      // $FlowFixMe
      const threshold = confirmationsTransactionSelector(reduxStore, { transaction: undefined })

      // THEN
      expect(threshold).toBe(0)
    })
  })
}

export default grantedSelectorTests
