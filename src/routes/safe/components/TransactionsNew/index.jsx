// @flow
import * as React from 'react'
import { List } from 'immutable'
import NoTransactions from '~/routes/safe/components/Transactions/NoTransactions'

type Props = SelectorProps &
  Actions & {
    safeName: string,
    safeAddress: string,
    threshold: number,
  }
class Transactions extends React.Component<Props, {}> {
  render() {
    const { transactions = List(), safeName, threshold } = this.props
    const hasTransactions = false

    return <React.Fragment>{hasTransactions ? <div /> : <NoTransactions />}</React.Fragment>
  }
}

export default Transactions
