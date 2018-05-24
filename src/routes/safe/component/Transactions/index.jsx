// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Stepper from '~/components/Stepper'
import { sleep } from '~/utils/timer'
import { type Safe } from '~/routes/safe/store/model/safe'
import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'
import transaction, { createTransaction, TX_NAME_PARAM, TX_DESTINATION_PARAM, TX_VALUE_PARAM } from './transactions'
import MultisigForm from './MultisigForm'
import ReviewTx from './ReviewTx'

const getSteps = () => [
  'Fill Mutlisig Tx form', 'Review Tx',
]

type Props = SelectorProps & Actions & {
  safe: Safe,
  balance: number,
  onReset: () => void,
}

type State = {
  done: boolean,
}

export const SEE_TXS_BUTTON_TEXT = 'VISIT TXS'

class Transactions extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onTransaction = async (values: Object) => {
    try {
      const { safe, userAddress } = this.props
      const nonce = Date.now()
      const destination = values[TX_DESTINATION_PARAM]
      const value = values[TX_VALUE_PARAM]
      const tx = await transaction(safe.get('address'), destination, value, nonce, userAddress)
      await createTransaction(
        values[TX_NAME_PARAM], nonce, destination, value, userAddress,
        safe.get('owners'), tx, safe.get('address'), safe.get('confirmations'),
      )
      await sleep(1500)
      this.props.fetchTransactions()
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while creating multisig tx ' + error)
    }
  }

  onReset = () => {
    this.setState({ done: false })
    this.props.onReset() // This is for show the TX list component
  }

  render() {
    const { done } = this.state
    const { balance } = this.props
    const steps = getSteps()
    const finishedButton = <Stepper.FinishButton title={SEE_TXS_BUTTON_TEXT} />

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onTransaction}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page balance={balance}>
            { MultisigForm }
          </Stepper.Page>
          <Stepper.Page>
            { ReviewTx }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default connect(selector, actions)(Transactions)
