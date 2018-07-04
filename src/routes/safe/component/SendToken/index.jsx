// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Stepper from '~/components/Stepper'
import { sleep } from '~/utils/timer'
import { type Safe } from '~/routes/safe/store/model/safe'
import { type Balance } from '~/routes/safe/store/model/balance'
import { createTransaction } from '~/wallets/createTransactions'
import { getStandardTokenContract } from '~/routes/safe/store/actions/fetchBalances'
import { EMPTY_DATA } from '~/wallets/ethTransactions'
import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'
import SendTokenForm, { TKN_DESTINATION_PARAM, TKN_VALUE_PARAM } from './SendTokenForm'
import ReviewTx from './ReviewTx'

const getSteps = () => [
  'Fill Move Token form', 'Review Move Token form',
]

type Props = SelectorProps & Actions & {
  safe: Safe,
  balance: Balance,
  onReset: () => void,
}

type State = {
  done: boolean,
}

export const SEE_TXS_BUTTON_TEXT = 'VISIT TXS'

const isEther = (symbol: string) => symbol === 'ETH'

const getTransferData = async (tokenAddress: string, to: string, amount: number) => {
  const StandardToken = await getStandardTokenContract()
  const myToken = await StandardToken.at(tokenAddress)

  return myToken.contract.transfer.getData(to, amount)
}

const processTokenTransfer = async (safe: Safe, balance: Balance, to: string, amount: number, userAddress: string) => {
  const symbol = balance.get('symbol')

  if (isEther(symbol)) {
    return Promise.resolve()
  }

  const nonce = Date.now()
  const name = `Send ${amount} ${balance.get('symbol')} to ${to}`
  const value = isEther(symbol) ? amount : 0
  const tokenAddress = balance.get('address')
  const data = isEther(symbol)
    ? EMPTY_DATA
    : await getTransferData(tokenAddress, to, amount)

  return createTransaction(safe, name, tokenAddress, value, nonce, userAddress, data)
}

class AddTransaction extends React.Component<Props, State> {
  state = {
    done: false,
  }

  onTransaction = async (values: Object) => {
    try {
      const { safe, balance, userAddress } = this.props

      const amount = values[TKN_VALUE_PARAM]
      const destination = values[TKN_DESTINATION_PARAM]
      await processTokenTransfer(safe, balance, destination, amount, userAddress)
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
    const { balance } = this.props
    const steps = getSteps()
    const finishedButton = <Stepper.FinishButton title={SEE_TXS_BUTTON_TEXT} />
    const symbol = balance.get('symbol')

    return (
      <React.Fragment>
        <Stepper
          finishedTransaction={done}
          finishedButton={finishedButton}
          onSubmit={this.onTransaction}
          steps={steps}
          onReset={this.onReset}
        >
          <Stepper.Page funds={balance.get('funds')} symbol={symbol}>
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

export default connect(selector, actions)(AddTransaction)
