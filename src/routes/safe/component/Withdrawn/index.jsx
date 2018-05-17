// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Stepper from '~/components/Stepper'
import { sleep } from '~/utils/timer'
import { type DailyLimit } from '~/routes/safe/store/model/dailyLimit'
import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'
import withdrawn from './withdrawn'
import WithdrawnForm from './WithdrawnForm'
import Review from './Review'

const getSteps = () => [
  'Fill Withdrawn Form', 'Review Withdrawn',
]

type Props = SelectorProps & Actions & {
  safeAddress: string,
  dailyLimit: DailyLimit,
}

type State = {
  done: boolean,
}

export const SEE_TXS_BUTTON_TEXT = 'RESET'

class Withdrawn extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onWithdrawn = async (values: Object) => {
    try {
      const { safeAddress, userAddress } = this.props
      await withdrawn(values, safeAddress, userAddress)
      await sleep(3500)
      this.props.fetchDailyLimit(safeAddress)
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
          onSubmit={this.onWithdrawn}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page limit={dailyLimit.get('value')} spentToday={dailyLimit.get('spentToday')}>
            { WithdrawnForm }
          </Stepper.Page>
          <Stepper.Page>
            { Review }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default connect(selector, actions)(Withdrawn)

