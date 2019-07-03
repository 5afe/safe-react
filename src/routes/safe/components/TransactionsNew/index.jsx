// @flow
import * as React from 'react'
import { List } from 'immutable'
import NoTransactions from '~/routes/safe/components/TransactionsNew/NoTransactions'
import TxsTable from '~/routes/safe/components/TransactionsNew/TxsTable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Owner } from '~/routes/safe/store/models/owner'

type Props = {
  safeAddress: string,
  threshold: number,
  fetchTransactions: Function,
  transactions: List<Transaction>,
  owners: List<Owner>,
  userAddress: string,
  granted: boolean,
}

class Transactions extends React.Component<Props, {}> {
  componentDidMount() {
    const { safeAddress, fetchTransactions } = this.props

    fetchTransactions(safeAddress)
  }

  render() {
    const {
      transactions, owners, threshold, userAddress, granted,
    } = this.props
    const hasTransactions = transactions.size > 0

    return (
      <React.Fragment>
        {hasTransactions ? (
          <TxsTable
            transactions={transactions}
            threshold={threshold}
            owners={owners}
            userAddress={userAddress}
            granted={granted}
          />
        ) : (
          <NoTransactions />
        )}
      </React.Fragment>
    )
  }
}

Transactions.defaultProps = {
  transactions: List(),
}

export default Transactions
