// @flow
import * as React from 'react'
import { type Token } from '~/routes/tokens/store/model/token'
import Stepper from '~/components/Stepper'
import RemoveTokenAction from '~/routes/tokens/store/actions/removeToken'
import Review from '~/routes/tokens/component/RemoveToken/Review'

const getSteps = () => [
  'Review remove token operation',
]

type Props = {
  token: Token,
  safeAddress: string,
  removeTokenAction: typeof RemoveTokenAction,
  onReset: () => void,
}

type State = {
  done: boolean,
}

export const REMOVE_TOKEN_RESET_BUTTON_TEXT = 'RESET'

export const removeToken = async (safeAddress: string, token: Token, removeTokenAction: typeof RemoveTokenAction) =>
  removeTokenAction(safeAddress, token)

class RemoveToken extends React.PureComponent<Props, State> {
  state = {
    done: false,
  }

  onRemoveReset = () => {
    this.setState({ done: false }, this.props.onReset())
  }

  executeRemoveOperation = async () => {
    try {
      const { token, safeAddress, removeTokenAction } = this.props
      await removeToken(safeAddress, token, removeTokenAction)
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while removing owner ' + error)
    }
  }

  render() {
    const { done } = this.state
    const { token } = this.props
    const finishedButton = <Stepper.FinishButton title={REMOVE_TOKEN_RESET_BUTTON_TEXT} />
    const steps = getSteps()

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.executeRemoveOperation}
          steps={steps}
          onReset={this.onRemoveReset}
        >
          <Stepper.Page name={token.get('name')} symbol={token.get('symbol')} funds={token.get('funds')}>
            { Review }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default RemoveToken
