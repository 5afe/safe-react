// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Stepper from '~/components/Stepper'
import { type DailyLimit } from '~/routes/safe/store/model/dailyLimit'
import selector, { type SelectorProps } from './selector'
import withdraw from './withdraw'
import WithdrawForm from './WithdrawForm'
import Review from './Review'

const getSteps = () => [
  'Fill Withdraw Form', 'Review Withdraw',
]

type Props = SelectorProps & {
  safeAddress: string,
  dailyLimit: DailyLimit,
}

type State = {
  done: boolean,
}

export const SEE_TXS_BUTTON_TEXT = 'RESET'

class Withdraw extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onWithdraw = async (values: Object) => {
    try {
      const { safeAddress, userAddress } = this.props
      await withdraw(values, safeAddress, userAddress)
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while withdrawing funds ' + error)
    }
  }

  onReset = () => {
    this.setState({ done: false })
  }

  render() {
    const { dailyLimit } = this.props
    const { done } = this.state
    const steps = getSteps()
    const finishedButton = <Stepper.FinishButton title={SEE_TXS_BUTTON_TEXT} />

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onWithdraw}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page limit={dailyLimit.get('value')} spentToday={dailyLimit.get('spentToday')}>
            { WithdrawForm }
          </Stepper.Page>
          <Stepper.Page>
            { Review }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default connect(selector)(Withdraw)

