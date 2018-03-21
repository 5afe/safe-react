// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import contract from 'truffle-contract'
import PageFrame from '~/components/layout/PageFrame'
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import Safe from '#/GnosisSafe.json'
import Layout from '../components/Layout'
import selector from './selector'
import { getAccountsFrom, getThresholdFrom } from './safe'

type Props = {
  provider: string,
  userAccount: string,
}

type State = {
  safeAddress: string,
  funds: number,
}

class Open extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      safeAddress: '',
      funds: 0,
    }

    this.safe = contract(Safe)
  }

  onAddFunds = async (values: Object) => {
    const { fundsToAdd } = values
    const { safeAddress } = this.state
    try {
      const web3 = getWeb3()
      const accounts = await promisify(cb => web3.eth.getAccounts(cb))
      const txData = { from: accounts[0], to: safeAddress, value: web3.toWei(fundsToAdd, 'ether') }
      await promisify(cb => web3.eth.sendTransaction(txData, cb))
      const funds = await promisify(cb => web3.eth.getBalance(safeAddress, cb))
      const fundsInEther = funds ? web3.fromWei(funds.toNumber(), 'ether') : 0
      this.setState({ funds: fundsInEther })
    } catch (error) {
      // eslint-disable-next-line
      console.log(`Errog adding funds to safe${error}`)
    }
  }


  onCallSafeContractSubmit = async (values) => {
    try {
      const { userAccount } = this.props
      const accounts = getAccountsFrom(values)
      const numConfirmations = getThresholdFrom(values)

      const web3 = getWeb3()
      this.safe.setProvider(web3.currentProvider)

      const safeInstance = await this.safe.new(accounts, numConfirmations, 0, 0, { from: userAccount, gas: '5000000' })
      const { transactionHash } = safeInstance

      const transactionReceipt = await promisify(cb => web3.eth.getTransactionReceipt(transactionHash, cb))
      // eslint-disable-next-line
      console.log(`Transaction Receipt${JSON.stringify(transactionReceipt)}`)
      this.setState({ safeAddress: safeInstance.address })
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while creating the Safe' + error)
    }
  }

  safe: any

  render() {
    const { provider, userAccount } = this.props
    const { safeAddress, funds } = this.state
    return (
      <PageFrame>
        { provider
          ? <Layout
            userAccount={userAccount}
            safeAddress={safeAddress}
            onAddFunds={this.onAddFunds}
            funds={funds}
            onCallSafeContractSubmit={this.onCallSafeContractSubmit}
          />
          : <div>No metamask detected</div>
        }
      </PageFrame>
    )
  }
}

export default connect(selector)(Open)
