// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import { connect } from 'react-redux'
import { getSafeEthereumInstance, createTransaction } from '~/routes/safe/component/AddTransaction/createTransactions'
import { sleep } from '~/utils/timer'
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

export const CHANGE_THRESHOLD_RESET_BUTTON_TEXT = 'RESET'

class Threshold extends React.PureComponent<Props, State> {
  state = {
    done: false,
  }

  onThreshold = async (values: Object) => {
    try {
      const { safe, userAddress } = this.props // , fetchThreshold } = this.props
      const newThreshold = values[THRESHOLD_PARAM]
      const gnosisSafe = await getSafeEthereumInstance(safe.get('address'))
      const nonce = Date.now()
      const data = gnosisSafe.contract.changeThreshold.getData(newThreshold)
      await createTransaction(safe, `Change Safe's threshold [${nonce}]`, safe.get('address'), 0, nonce, userAddress, data)
      await sleep(1500)
      await this.props.fetchTransactions()
      await this.props.fetchThreshold(safe.get('address'))
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while changing threshold ' + error)
    }
  }

  onReset = () => {
    this.setState({ done: false })
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
