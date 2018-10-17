// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import { connect } from 'react-redux'
import { getSafeEthereumInstance, createTransaction } from '~/logic/safe/safeFrontendOperations'
import { type Safe } from '~/routes/safe/store/model/safe'
import ThresholdForm, { THRESHOLD_PARAM } from './ThresholdForm'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'
import Review from './Review'

type Props = SelectorProps & Actions & {
  numOwners: number,
  safe: Safe,
  onReset: () => void,
}

const getSteps = () => [
  'Fill Change threshold Form', 'Review change threshold operation',
]

type State = {
  done: boolean,
}

export const CHANGE_THRESHOLD_RESET_BUTTON_TEXT = 'SEE TXs'

class Threshold extends React.PureComponent<Props, State> {
  state = {
    done: false,
  }

  onThreshold = async (values: Object) => {
    try {
      const { safe, userAddress } = this.props // , fetchThreshold } = this.props
      const newThreshold = values[THRESHOLD_PARAM]
      const safeAddress = safe.get('address')
      const gnosisSafe = await getSafeEthereumInstance(safeAddress)
      const nonce = await gnosisSafe.nonce()
      const data = gnosisSafe.contract.changeThreshold.getData(newThreshold)
      await createTransaction(safe, `Change Safe's threshold [${nonce}]`, safeAddress, 0, nonce, userAddress, data)
      await this.props.fetchTransactions(safeAddress)
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while changing threshold ' + error)
    }
  }

  onReset = () => {
    this.setState({ done: false })
    this.props.onReset()
  }

  render() {
    const { numOwners, safe } = this.props
    const { done } = this.state
    const steps = getSteps()
    const finishedButton = <Stepper.FinishButton title={CHANGE_THRESHOLD_RESET_BUTTON_TEXT} />

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onThreshold}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page numOwners={numOwners} safe={safe}>
            { ThresholdForm }
          </Stepper.Page>
          <Stepper.Page>
            { Review }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default connect(selector, actions)(Threshold)
