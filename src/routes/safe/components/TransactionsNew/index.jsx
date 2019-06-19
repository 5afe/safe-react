// @flow
import * as React from 'react'
import { List } from 'immutable'
import NoTransactions from '~/routes/safe/components/TransactionsNew/NoTransactions'
import TxsTable from '~/routes/safe/components/TransactionsNew/TxsTable'
import { type Transaction } from '~/routes/safe/store/models/transaction'

type Props = {
  safeAddress: string,
  threshold: number,
  fetchTransactions: Function,
  transactions: List<Transaction>,
}

class Transactions extends React.Component<Props, {}> {
  componentDidMount() {
    const { safeAddress, fetchTransactions } = this.props

    fetchTransactions(safeAddress)
  }

  render() {
    const { transactions, safeName, threshold } = this.props
    const hasTransactions = transactions.size > 0

    return (
      <React.Fragment>{hasTransactions ? <TxsTable transactions={transactions} /> : <NoTransactions />}</React.Fragment>
    )
  }
}

Transactions.defaultProps = {
  transactions: List(),
}

export default Transactions
