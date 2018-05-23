// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import MultisigForm from './MultisigForm'
import ReviewTx from './ReviewTx'

const getSteps = () => [
  'Fill Mutlisig Tx form', 'Review Tx',
]

/*
type Props = SelectorProps & Actions & {
  safeAddress: string,
  dailyLimit: DailyLimit,
}
*/

type Props = {
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
    // eslint-disable-next-line
    console.log("Executing transaction with params " + JSON.stringify(values))
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

export default Transactions

