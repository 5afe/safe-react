// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import NoTransactions from '~/routes/safe/component/Transactions/NoTransactions'
import GnoTransaction from '~/routes/safe/component/Transactions/Transaction'
import selector, { type SelectorProps } from './selector'

type Props = SelectorProps & {
  onAddTx: () => void,
  safeName: string,
}

class Transactions extends React.Component<Props, {}> {
  onConfirm = () => {
    // eslint-disable-next-line
    console.log("Confirming tx")
  }

  onExecute = () => {
    // eslint-disable-next-line
    console.log("Confirming tx")
  }

  render() {
    const { transactions, onAddTx, safeName } = this.props
    const hasTransactions = transactions.count() > 0

    return (
      <React.Fragment>
        { hasTransactions
          ? transactions.map((tx: Transaction) => <GnoTransaction key={tx.get('nonce')} safeName={safeName} transaction={tx} />)
          : <NoTransactions onAddTx={onAddTx} />
        }
      </React.Fragment>
    )
  }
}

export default connect(selector)(Transactions)
