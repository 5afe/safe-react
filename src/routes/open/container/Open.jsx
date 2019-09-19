// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import {
  getAccountsFrom, getThresholdFrom, getNamesFrom, getSafeNameFrom, getOwnersFrom,
} from '~/routes/open/utils/safeDataExtractor'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { getGnosisSafeInstanceAt, deploySafeContract, initContracts } from '~/logic/contracts/safeContracts'
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
  const ownerAddresses = getAccountsFrom(values)
  const numConfirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const ownersNames = getNamesFrom(values)

  await initContracts()
  const safe = await deploySafeContract(ownerAddresses, numConfirmations, userAccount)
  await checkReceiptStatus(safe.tx)

  const safeAddress = safe.logs[0].args.proxy
  const safeContract = await getGnosisSafeInstanceAt(safeAddress)
  const safeProps = await buildSafe(safeAddress, name)
  const owners = getOwnersFrom(ownersNames, ownerAddresses.sort())
  safeProps.owners = owners

  addSafe(safeProps)

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
  async componentDidMount() {
    await initContracts()
  }

  onCallSafeContractSubmit = async (values) => {
    try {
      const { userAccount, addSafe } = this.props
      createSafe(values, userAccount, addSafe)
      history.push(OPENING_ADDRESS)
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error while creating the Safe: ' + error)
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
