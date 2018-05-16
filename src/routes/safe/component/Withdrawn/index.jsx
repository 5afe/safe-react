// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Stepper from '~/components/Stepper'
import { SAFELIST_ADDRESS } from '~/routes/routes'
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

export const SEE_TXS_BUTTON_TEXT = 'DONE'

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

  render() {
    const { dailyLimit, safeAddress } = this.props
    const { done } = this.state
    const steps = getSteps()

    return (
      <React.Fragment>
        <Stepper
          goPath={`${SAFELIST_ADDRESS}/${safeAddress}`}
          goTitle={SEE_TXS_BUTTON_TEXT}
          onSubmit={this.onWithdrawn}
          finishedTransaction={done}
          steps={steps}
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

