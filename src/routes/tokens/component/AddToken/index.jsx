// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import { getHumanFriendlyToken } from '~/routes/tokens/store/actions/fetchTokens'
import FirstPage, { TOKEN_ADRESS_PARAM } from '~/routes/tokens/component/AddToken/FirstPage'
import SecondPage, { TOKEN_SYMBOL_PARAM, TOKEN_DECIMALS_PARAM, TOKEN_LOGO_URL_PARAM, TOKEN_NAME_PARAM } from '~/routes/tokens/component/AddToken/SecondPage'
import { makeToken, type Token } from '~/routes/tokens/store/model/token'
import addTokenAction from '~/routes/tokens/store/actions/addToken'
import Review from './Review'

export const getSteps = () => [
  'Fill Add Token Form', 'Check optional attributes', 'Review Information',
]

type Props = {
  tokens: string[],
  safeAddress: string,
  addToken: typeof addTokenAction,
}

type State = {
  done: boolean,
}

export const ADD_TOKEN_RESET_BUTTON_TEXT = 'RESET'

export const addTokenFnc = async (values: Object, addToken: typeof addTokenAction, safeAddress: string) => {
  const address = values[TOKEN_ADRESS_PARAM]
  const name = values[TOKEN_NAME_PARAM]
  const symbol = values[TOKEN_SYMBOL_PARAM]
  const decimals = values[TOKEN_DECIMALS_PARAM]
  const logo = values[TOKEN_LOGO_URL_PARAM]

  const token: Token = makeToken({
    address,
    name,
    symbol,
    decimals: Number(decimals),
    logoUrl: logo,
    status: true,
    removable: true,
  })

  return addToken(safeAddress, token)
}

class AddToken extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onAddToken = async (values: Object) => {
    const { addToken, safeAddress } = this.props

    const result = addTokenFnc(values, addToken, safeAddress)
    this.setState({ done: true })

    return result
  }

  onReset = () => {
    this.setState({ done: false })
  }

  fetchInitialPropsSecondPage = async (values: Object) => {
    const tokenAddress = values[TOKEN_ADRESS_PARAM]
    const erc20Token = await getHumanFriendlyToken()
    const instance = await erc20Token.at(tokenAddress)

    const name = await instance.name()
    const symbol = await instance.symbol()
    const decimals = await instance.decimals()

    return ({
      [TOKEN_SYMBOL_PARAM]: symbol,
      [TOKEN_DECIMALS_PARAM]: `${decimals}`,
      [TOKEN_NAME_PARAM]: name,
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
