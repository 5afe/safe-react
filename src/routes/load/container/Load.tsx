//
import * as React from 'react'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import { FIELD_LOAD_ADDRESS, FIELD_LOAD_NAME } from '../components/fields'

import actions from './actions'
import selector from './selector'

import Page from 'src/components/layout/Page'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { SAFES_KEY, saveSafes } from 'src/logic/safe/utils'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { getNamesFrom, getOwnersFrom } from 'src/routes/open/utils/safeDataExtractor'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { buildSafe } from 'src/routes/safe/store/actions/fetchSafe'
import { history } from 'src/store'
import { loadFromStorage } from 'src/utils/storage'

export const loadSafe = async (safeName, safeAddress, owners, addSafe) => {
  const safeProps = await buildSafe(safeAddress, safeName)
  safeProps.owners = owners

  await addSafe(safeProps)

  const storedSafes = (await loadFromStorage(SAFES_KEY)) || {}
  storedSafes[safeAddress] = safeProps

  saveSafes(storedSafes)
}

class Load extends React.Component<any> {
  onLoadSafeSubmit = async (values) => {
    try {
      const { addSafe } = this.props
      const web3 = getWeb3()
      const safeName = values[FIELD_LOAD_NAME]
      let safeAddress = values[FIELD_LOAD_ADDRESS]
      if (safeAddress) {
        safeAddress = web3.utils.toChecksumAddress(safeAddress)
      }
      const ownerNames = getNamesFrom(values)

      const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
      const ownerAddresses = await gnosisSafe.getOwners()
      const owners = getOwnersFrom(ownerNames, ownerAddresses.sort())

      await loadSafe(safeName, safeAddress, owners, addSafe)

      const url = `${SAFELIST_ADDRESS}/${safeAddress}/balances`
      history.push(url)
    } catch (error) {
      console.error('Error while loading the Safe', error)
    }
  }

  render() {
    const { network, provider, userAddress } = this.props

    return (
      <Page>
        <Layout
          network={network}
          onLoadSafeSubmit={this.onLoadSafeSubmit}
          provider={provider}
          userAddress={userAddress}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(Load)
