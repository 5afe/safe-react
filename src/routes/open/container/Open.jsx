// @flow
import queryString from 'query-string'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Layout from '../components/Layout'

import actions, { type Actions, type AddSafe } from './actions'
import selector from './selector'

import Page from '~/components/layout/Page'
import { getGnosisSafeInstanceAt, getSafeDeploymentTransaction } from '~/logic/contracts/safeContracts'
import { checkReceiptStatus } from '~/logic/wallets/ethTransactions'
import {
  getAccountsFrom,
  getNamesFrom,
  getOwnersFrom,
  getSafeNameFrom,
  getThresholdFrom,
} from '~/routes/open/utils/safeDataExtractor'
import { OPENING_ADDRESS, SAFELIST_ADDRESS, stillInOpeningView } from '~/routes/routes'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { history } from '~/store'

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

  const deploymentTx = await getSafeDeploymentTransaction(ownerAddresses, numConfirmations, userAccount)
  console.log({ deploymentTx })

  deploymentTx
    .send({ from: userAccount, value: 0 })
    .once('transactionHash', hash => {
      console.log({ hash })
    })
    .then(async receipt => {
      console.log({ receipt })
      await checkReceiptStatus(receipt.tx)

      const safeAddress = receipt.logs[0].args.proxy
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
            tx: receipt.tx,
          },
        }

        history.push(url)
      }

      // returning info for testing purposes, in app is fully async
      return { safeAddress: safeContract.address, safeTx: receipt }
    })
}

class Open extends React.Component<Props> {
  onCallSafeContractSubmit = async values => {
    try {
      const { addSafe, userAccount } = this.props
      createSafe(values, userAccount, addSafe)
      history.push(OPENING_ADDRESS)
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error while creating the Safe: ' + error)
    }
  }

  render() {
    const { location, network, provider, userAccount } = this.props
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
          onCallSafeContractSubmit={this.onCallSafeContractSubmit}
          provider={provider}
          safeProps={safeProps}
          userAccount={userAccount}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(withRouter(Open))
