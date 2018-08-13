// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import NoTransactions from '~/routes/safe/component/Transactions/NoTransactions'
import GnoTransaction from '~/routes/safe/component/Transactions/Transaction'
import { processTransaction } from './processTransactions'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = SelectorProps & Actions & {
  safeName: string,
  safeAddress: string,
  threshold: number,

}
class Transactions extends React.Component<Props, {}> {
  onProcessTx = async (tx: Transaction, alreadyConfirmed: number) => {
    const {
      fetchTransactions, safeAddress, userAddress,
    } = this.props

    await processTransaction(safeAddress, tx, alreadyConfirmed, userAddress)
    fetchTransactions()
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
