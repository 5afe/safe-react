// @flow
import * as React from 'react'
import { List } from 'immutable'
import NoTransactions from '~/routes/safe/components/Transactions/NoTransactions'

type Props = {
  safeAddress: string,
  threshold: number,
  fetchTransactions: Function
}

class Transactions extends React.Component<Props, {}> {
  componentDidMount() {
    const { safeAddress, fetchTransactions } = this.props

    fetchTransactions(safeAddress)
  }

  render() {
    const { transactions, safeName, threshold } = this.props
    const hasTransactions = false

    return <React.Fragment>{hasTransactions ? <div /> : <NoTransactions />}</React.Fragment>
  }
}

Transactions.defaultProps = {
  transactions: List(),
}

export default Transactions
