// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import contract from 'truffle-contract'
import PageFrame from '~/components/layout/PageFrame'
import { getAccountsFrom, getThresholdFrom } from '~/routes/open/utils/safeDataExtractor'
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import Safe from '#/GnosisSafe.json'
import selector from './selector'
import Layout from '../components/Layout'

type Props = {
  provider: string,
  userAccount: string,
}

type State = {
  safeAddress: string,
  safeTx: string,
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
      this.setState({ safeAddress: safeInstance.address, safeTx: transactionReceipt })
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
      <PageFrame>
        <Layout
          provider={provider}
          userAccount={userAccount}
          safeAddress={safeAddress}
          safeTx={safeTx}
          onCallSafeContractSubmit={this.onCallSafeContractSubmit}
        />
      </PageFrame>
    )
  }
}

export default connect(selector)(Open)
