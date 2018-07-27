// @flow
import * as React from 'react'
import { connect } from 'react-redux'

import Page from '~/components/layout/Page'
import { getAccountsFrom, getThresholdFrom, getNamesFrom, getSafeNameFrom, getDailyLimitFrom } from '~/routes/open/utils/safeDataExtractor'
import { getWeb3 } from '~/wallets/getWeb3'
import { getGnosisSafeContract, deploySafeContract, initContracts } from '~/wallets/safeContracts'
import { checkReceiptStatus } from '~/wallets/ethTransactions'
import selector from './selector'
import actions, { type Actions, type AddSafe } from './actions'
import Layout from '../components/Layout'

type Props = Actions & {
  provider: string,
  userAccount: string,
}

export type OpenState = {
  safeAddress: string,
  safeTx: string,
}

export const createSafe = async (values: Object, userAccount: string, addSafe: AddSafe): Promise<OpenState> => {
  const accounts = getAccountsFrom(values)
  const numConfirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const owners = getNamesFrom(values)
  const dailyLimit = getDailyLimitFrom(values)

  const web3 = getWeb3()
  const GnosisSafe = getGnosisSafeContract(web3)

  await initContracts()
  const safe = await deploySafeContract(accounts, numConfirmations, dailyLimit, userAccount)
  checkReceiptStatus(safe.tx)

  const param = safe.logs[1].args.proxy
  const safeContract = GnosisSafe.at(param)

  addSafe(name, safeContract.address, numConfirmations, dailyLimit, owners, accounts)

  return { safeAddress: safeContract.address, safeTx: safe }
}

class Open extends React.Component<Props, OpenState> {
  constructor() {
    super()

    this.state = {
      safeAddress: '',
      safeTx: '',
    }
  }

  onCallSafeContractSubmit = async (values) => {
    try {
      const { userAccount, addSafe } = this.props
      const safeInstance = await createSafe(values, userAccount, addSafe)
      this.setState(safeInstance)
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while creating the Safe' + error)
    }
  }

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
