// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import contract from 'truffle-contract'
import Page from '~/components/layout/Page'
import { getAccountsFrom, getThresholdFrom, getNamesFrom, getSafeNameFrom, getDailyLimitFrom } from '~/routes/open/utils/safeDataExtractor'
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import Safe from '#/GnosisSafe.json'
import selector from './selector'
import actions, { type Actions } from './actions'
import Layout from '../components/Layout'

type Props = Actions & {
  provider: string,
  userAccount: string,
}

type State = {
  safeAddress: string,
  safeTx: string,
}

const createSafe = async (safeContract, values, userAccount, addSafe) => {
  const accounts = getAccountsFrom(values)
  const numConfirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const owners = getNamesFrom(values)
  const dailyLimit = getDailyLimitFrom(values)

  const web3 = getWeb3()
  safeContract.setProvider(web3.currentProvider)

  const safe = await safeContract.new(accounts, numConfirmations, 0, 0, { from: userAccount, gas: '5000000' })
  addSafe(name, safe.address, numConfirmations, dailyLimit, owners, accounts)
  return safe
}

class Open extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      safeAddress: '',
      safeTx: '',
    }

    this.safe = contract(Safe)
  }

  onCallSafeContractSubmit = async (values) => {
    try {
      const { userAccount, addSafe } = this.props
      const web3 = getWeb3()

      const safeInstance = await createSafe(this.safe, values, userAccount, addSafe)
      const { address, transactionHash } = safeInstance

      const transactionReceipt = await promisify(cb => web3.eth.getTransactionReceipt(transactionHash, cb))

      this.setState({ safeAddress: address, safeTx: transactionReceipt })
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while creating the Safe' + error)
    }
  }

  safe: any

  render() {
    const { safeAddress, safeTx } = this.state
    const { provider, userAccount } = this.props

    return (
      <Page>
        <Layout
          provider={provider}
          userAccount={userAccount}
          safeAddress={safeAddress}
          safeTx={safeTx}
          onCallSafeContractSubmit={this.onCallSafeContractSubmit}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(Open)
