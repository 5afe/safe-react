// @flow
import * as React from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import NoTransactions from '~/routes/safe/component/Transactions/NoTransactions'
import GnoTransaction from '~/routes/safe/component/Transactions/Transaction'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'
import { processTransaction } from '~/logic/safe/safeFrontendOperations'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = SelectorProps & Actions & {
  safeName: string,
  safeAddress: string,
  threshold: number,

}
class Transactions extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.fetchTransactions(this.props.safeAddress)
  }

  onProcessTx = async (tx: Transaction, alreadyConfirmed: number) => {
    const {
      fetchTransactions, safeAddress, userAddress, threshold,
    } = this.props

    const confirmations = tx.get('confirmations')
    const usersConfirmed = List(confirmations.map((confirmation: Confirmation) =>
      confirmation.get('owner').get('address')))
    const userHasAlreadyConfirmed = confirmations.filter((confirmation: Confirmation) => {
      const ownerAddress = confirmation.get('owner').get('address')
      const samePerson = sameAddress(ownerAddress, userAddress)

      return samePerson && confirmation.get('type') === 'confirmation'
    }).count() > 0

    if (userHasAlreadyConfirmed) {
      throw new Error('Owner has already confirmed this transaction')
    }

    await processTransaction(safeAddress, tx, alreadyConfirmed, userAddress, threshold, usersConfirmed)
    fetchTransactions(safeAddress)
  }

  render() {
    const { transactions, safeName, threshold } = this.props
    const hasTransactions = transactions.count() > 0

    return (
      <React.Fragment>
        { hasTransactions
          ? transactions.map((tx: Transaction) => <GnoTransaction key={tx.get('nonce')} safeName={safeName} onProcessTx={this.onProcessTx} transaction={tx} threshold={threshold} />)
          : <NoTransactions />
        }
      </React.Fragment>
    )
  }
}

export default connect(selector, actions)(Transactions)
