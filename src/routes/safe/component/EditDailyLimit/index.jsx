// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import { connect } from 'react-redux'
import { createTransaction } from '~/routes/safe/component/AddTransaction/createTransactions'
import { getEditDailyLimitData } from '~/routes/safe/component/Withdraw/withdraw'
import { type Safe } from '~/routes/safe/store/model/safe'
import EditDailyLimitForm, { EDIT_DAILY_LIMIT_PARAM } from './EditDailyLimitForm'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'
import Review from './Review'

type Props = SelectorProps & Actions & {
  dailyLimit: number,
  onReset: () => void,
  safe: Safe,
}

const getSteps = () => [
  'Fill Edit Daily Limit Form', 'Review Edit Daily Limit operation',
]

type State = {
  done: boolean,
}

export const CHANGE_THRESHOLD_RESET_BUTTON_TEXT = 'START'

class EditDailyLimit extends React.PureComponent<Props, State> {
  state = {
    done: false,
  }

  onEditDailyLimit = async (values: Object) => {
    try {
      const { safe, userAddress } = this.props
      const newDailyLimit = values[EDIT_DAILY_LIMIT_PARAM]
      const safeAddress = safe.get('address')
      const data = await getEditDailyLimitData(safeAddress, 0, Number(newDailyLimit))
      const nonce = Date.now()
      await createTransaction(safe, `Change Safe's daily limit to ${newDailyLimit} [${nonce}]`, safeAddress, 0, nonce, userAddress, data)
      await this.props.fetchTransactions()
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while editing the daily limit ' + error)
    }
  }

  onReset = () => {
    this.setState({ done: false })
    this.props.onReset()
  }

  render() {
    const { dailyLimit } = this.props
    const { done } = this.state
    const steps = getSteps()
    const finishedButton = <Stepper.FinishButton title={CHANGE_THRESHOLD_RESET_BUTTON_TEXT} />

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onEditDailyLimit}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page dailyLimit={dailyLimit} >
            { EditDailyLimitForm }
          </Stepper.Page>
          <Stepper.Page>
            { Review }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default connect(selector, actions)(EditDailyLimit)
