// @flow
import * as React from 'react'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import Stepper from '~/components/Stepper'
import { sleep } from '~/utils/timer'
import { type Safe } from '~/routes/safe/store/model/safe'
import { getStandardTokenContract } from '~/routes/tokens/store/actions/fetchTokens'
import { type Token } from '~/routes/tokens/store/model/token'
import { isEther } from '~/utils/tokens'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { toNative } from '~/logic/wallets/tokens'
import { createTransaction } from '~/logic/safe/safeFrontendOperations'
import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'
import SendTokenForm, { TKN_DESTINATION_PARAM, TKN_VALUE_PARAM } from './SendTokenForm'
import ReviewTx from './ReviewTx'

const getSteps = () => [
  'Fill Move Token form', 'Review Move Token form',
]

type Props = SelectorProps & Actions & {
  safe: Safe,
  token: Token,
  onReset: () => void,
}

type State = {
  done: boolean,
}

export const SEE_TXS_BUTTON_TEXT = 'VISIT TXS'

const getTransferData = async (tokenAddress: string, to: string, amount: BigNumber) => {
  const StandardToken = await getStandardTokenContract()
  const myToken = await StandardToken.at(tokenAddress)

  return myToken.contract.transfer.getData(to, amount)
}

const processTokenTransfer = async (safe: Safe, token: Token, to: string, amount: number, userAddress: string) => {
  const symbol = token.get('symbol')
  const nonce = Date.now()
  const name = `Send ${amount} ${symbol} to ${to}`
  const value = isEther(symbol) ? amount : 0
  const tokenAddress = token.get('address')
  const destination = isEther(symbol) ? to : tokenAddress
  const data = isEther(symbol)
    ? EMPTY_DATA
    : await getTransferData(tokenAddress, to, await toNative(amount, token.get('decimals')))

  return createTransaction(safe, name, destination, value, nonce, userAddress, data)
}

class SendToken extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onTransaction = async (values: Object) => {
    try {
      const { safe, token, userAddress } = this.props

      const amount = values[TKN_VALUE_PARAM]
      const destination = values[TKN_DESTINATION_PARAM]

      await processTokenTransfer(safe, token, destination, amount, userAddress)
      await sleep(1500)
      this.props.fetchTransactions()
      this.setState({ done: true })
    } catch (error) {
      this.setState({ done: false })
      // eslint-disable-next-line
      console.log('Error while moving ERC20 token funds ' + error)
    }
  }

  onReset = () => {
    this.setState({ done: false })
    this.props.onReset() // This is for show the TX list component
  }

  render() {
    const { done } = this.state
    const { token } = this.props
    const steps = getSteps()
    const finishedButton = <Stepper.FinishButton title={SEE_TXS_BUTTON_TEXT} />
    const symbol = token.get('symbol')

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onTransaction}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page funds={token.get('funds')} symbol={symbol}>
            { SendTokenForm }
          </Stepper.Page>
          <Stepper.Page symbol={symbol}>
            { ReviewTx }
          </Stepper.Page>
        </Stepper>
      </React.Fragment>
    )
  }
}

export default connect(selector, actions)(SendToken)
