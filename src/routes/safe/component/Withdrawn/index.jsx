// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Stepper from '~/components/Stepper'
import { TXS_ADDRESS } from '~/routes/routes'
import selector, { type SelectorProps } from './selector'
import withdrawn from './withdrawn'
import WithdrawnForm from './WithdrawnForm'
import Review from './Review'

const getSteps = () => [
  'Fill Withdrawn Form', 'Review Withdrawn',
]

type Props = SelectorProps & {
  safeAddress: string,
}

type State = {
  done: boolean,
}

export const SEE_TXS_BUTTON_TEXT = 'SEE TXS'

class Withdrawn extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onWithdrawn = async (values: Object) => {
    try {
      const { safeAddress, userAddress } = this.props
      await withdrawn(values, safeAddress, userAddress)
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while withdrawing funds ' + error)
    }
  }

  render() {
    const { done } = this.state
    const steps = getSteps()

    return (
      <React.Fragment>
        <Stepper
          goPath={TXS_ADDRESS}
          goTitle={SEE_TXS_BUTTON_TEXT}
          onSubmit={this.onWithdrawn}
          finishedTransaction={done}
          steps={steps}
        >
          <Stepper.Page>
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

export default connect(selector)(Withdrawn)

