// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'
import Page from '~/components/layout/Page'
import {
  getAccountsFrom,
  getThresholdFrom,
  getNamesFrom,
  getSafeNameFrom,
  getOwnersFrom,
} from '~/routes/open/utils/safeDataExtractor'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { getGnosisSafeInstanceAt, deploySafeContract } from '~/logic/contracts/safeContracts'
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

export type SafePropsType = {
  name: string,
  ownerAddresses: string[],
  ownerNames: string[],
  threshold: string,
}

const validateQueryParams = (
  ownerAddresses?: string[],
  ownerNames?: string[],
  threshold?: string,
  safeName?: string,
) => {
  if (!ownerAddresses || !ownerNames || !threshold || !safeName) {
    return false
  }
  if (!ownerAddresses.length === 0 || ownerNames.length === 0) {
    return false
  }

  if (Number.isNaN(Number(threshold))) {
    return false
  }
  if (threshold > ownerAddresses.length) {
    return false
  }
  return true
}

export const createSafe = async (values: Object, userAccount: string, addSafe: AddSafe): Promise<OpenState> => {
  const numConfirmations = getThresholdFrom(values)
  const name = getSafeNameFrom(values)
  const ownersNames = getNamesFrom(values)
  const ownerAddresses = getAccountsFrom(values)

  const safe = await deploySafeContract(ownerAddresses, numConfirmations, userAccount)
  await checkReceiptStatus(safe.tx)

  const safeAddress = safe.logs[0].args.proxy
  const safeContract = await getGnosisSafeInstanceAt(safeAddress)
  const safeProps = await buildSafe(safeAddress, name)
  const owners = getOwnersFrom(ownersNames, ownerAddresses)
  safeProps.owners = owners

  addSafe(safeProps)
  if (stillInOpeningView()) {
    const url = {
      pathname: `${SAFELIST_ADDRESS}/${safeContract.address}/balances`,
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
  onCallSafeContractSubmit = async values => {
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
    const { provider, userAccount, network, location } = this.props
    const query: SafePropsType = queryString.parse(location.search, { arrayFormat: 'comma' })
    const { name, owneraddresses, ownernames, threshold } = query

    let safeProps = null
    if (validateQueryParams(owneraddresses, ownernames, threshold, name)) {
      safeProps = {
        name,
        ownerAddresses: owneraddresses,
        ownerNames: ownernames,
        threshold,
      }
    }
    return (
      <Page>
        <Layout
          network={network}
          provider={provider}
          userAccount={userAccount}
          onCallSafeContractSubmit={this.onCallSafeContractSubmit}
          safeProps={safeProps}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(withRouter(Open))
