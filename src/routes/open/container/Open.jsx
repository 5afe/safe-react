// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import { getAccountsFrom, getThresholdFrom, getNamesFrom, getSafeNameFrom, getDailyLimitFrom } from '~/routes/open/utils/safeDataExtractor'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getGnosisSafeContract, deploySafeContract, initContracts } from '~/logic/contracts/safeContracts'
import { checkReceiptStatus } from '~/logic/wallets/ethTransactions'
import { history } from '~/store'
import { OPENING_ADDRESS, stillInOpeningView, SAFELIST_ADDRESS } from '~/routes/routes'
import selector from './selector'
import actions, { type Actions, type AddSafe } from './actions'
import Layout from '../components/Layout'

type Props = Actions & {
  provider: string,
  userAccount: string,
  network: string,
}

export type OpenState = {
  safeAddress: string,
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

  if (stillInOpeningView()) {
    const url = {
      pathname: `${SAFELIST_ADDRESS}/${safeContract.address}`,
      state: {
        name,
        tx: safe.tx,
      },
    }

    history.push(url)
  }

  // returning info for testing purposes, in app is fully async
  return { safeAddress: safeContract.address, safeTx: safe }
}

class Open extends React.Component<Props> {
  onCallSafeContractSubmit = async (values) => {
    try {
      const { userAccount, addSafe } = this.props
      createSafe(values, userAccount, addSafe)
      history.push(OPENING_ADDRESS)
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while creating the Safe' + error)
    }
  }

  render() {
    const { provider, userAccount, network } = this.props

    return (
      <Page>
        <Layout
          network={network}
          provider={provider}
          userAccount={userAccount}
          onCallSafeContractSubmit={this.onCallSafeContractSubmit}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(Open)
