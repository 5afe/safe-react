// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { SAFES_KEY, saveSafes } from '~/logic/safe/utils'
import { loadFromStorage } from '~/utils/storage'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import { history } from '~/store'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'
import Layout from '../components/Layout'
import { getNamesFrom, getOwnersFrom } from '~/routes/open/utils/safeDataExtractor'
import { FIELD_LOAD_NAME, FIELD_LOAD_ADDRESS } from '../components/fields'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { getWeb3 } from '~/logic/wallets/getWeb3'

type Props = SelectorProps & Actions

export const loadSafe = async (
  safeName: string,
  safeAddress: string,
  owners: Array<*>,
  addSafe: Function,
) => {
  const safeProps = await buildSafe(safeAddress, safeName)
  safeProps.owners = owners

  await addSafe(safeProps)

  const storedSafes = (await loadFromStorage(SAFES_KEY)) || {}
  storedSafes[safeAddress] = safeProps

  saveSafes(storedSafes)
}

class Load extends React.Component<Props> {
  onLoadSafeSubmit = async (values: Object) => {
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

      const url = `${SAFELIST_ADDRESS}/${safeAddress}/balances/`
      history.push(url)
    } catch (error) {
      console.error('Error while loading the Safe', error)
    }
  }

  render() {
    const { provider, network, userAddress } = this.props

    return (
      <Page>
        <Layout
          network={network}
          provider={provider}
          onLoadSafeSubmit={this.onLoadSafeSubmit}
          userAddress={userAddress}
        />
      </Page>
    )
  }
}

export default connect<Object, Object, ?Function, ?Object>(
  selector,
  actions,
)(Load)
