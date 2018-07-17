// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import SecondPage, { SYMBOL_PARAM, DECIMALS_PARAM, NAME_PARAM } from '~/routes/tokens/component/AddToken/SecondPage'
import { getHumanFriendlyToken } from '~/routes/tokens/store/actions/fetchTokens'
import { TOKEN_PARAM } from '~/routes/tokens/component/AddToken/FirstPage'
import Review from './Review'
import FirstPage from './FirstPage'

export const getSteps = () => [
  'Fill Add Token Form', 'Check optional attributes', 'Review Information',
]

type Props = {
  tokens: string[],
  safeAddress: string,
}

type State = {
  done: boolean,
}

export const ADD_TOKEN_RESET_BUTTON_TEXT = 'RESET'

export const addToken = async (values: Object) => Promise.reject(values)

class AddToken extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onAddToken = async (values: Object) => {
    // eslint-disable-next-line
    console.log("onAddToken...")
    // eslint-disable-next-line
    console.log(values)
  }

  onReset = () => {
    this.setState({ done: false })
  }

  fetchInitialPropsSecondPage = async (values: Object) => {
    const tokenAddress = values[TOKEN_PARAM]
    const erc20Token = await getHumanFriendlyToken()
    const instance = await erc20Token.at(tokenAddress)

    const name = await instance.name()
    const symbol = await instance.symbol()
    const decimals = await instance.decimals()

    return ({
      [SYMBOL_PARAM]: symbol,
      [DECIMALS_PARAM]: `${decimals}`,
      [NAME_PARAM]: name,
    })
  }

  render() {
    const { tokens, safeAddress } = this.props
    const { done } = this.state
    const steps = getSteps()
    const finishedButton = <Stepper.FinishButton title={ADD_TOKEN_RESET_BUTTON_TEXT} />

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onAddToken}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page addresses={tokens} prepareNextInitialProps={this.fetchInitialPropsSecondPage}>
            { FirstPage }
          </Stepper.Page>
          <Stepper.Page safeAddress={safeAddress}>
            { SecondPage }
          </Stepper.Page>
          <Stepper.Page>
            { Review }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default AddToken
