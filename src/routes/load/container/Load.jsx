// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { SAFES_KEY, saveSafes } from '~/logic/safe/utils'
import { load } from '~/utils/storage'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import { history } from '~/store'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions, type UpdateSafe } from './actions'
import Layout from '../components/Layout'
import { FIELD_LOAD_NAME, FIELD_LOAD_ADDRESS } from '../components/fields'

type Props = SelectorProps & Actions

export const loadSafe = async (safeName: string, safeAddress: string, updateSafe: UpdateSafe) => {
  const safeRecord = await buildSafe(safeAddress, safeName)

  await updateSafe(safeRecord)

  const storedSafes = load(SAFES_KEY) || {}
  storedSafes[safeAddress] = safeRecord.toJSON()

  saveSafes(storedSafes)
}

class Load extends React.Component<Props> {
  onLoadSafeSubmit = async (values: Object) => {
    try {
      const { updateSafe } = this.props
      const safeName = values[FIELD_LOAD_NAME]
      const safeAddress = values[FIELD_LOAD_ADDRESS]

      await loadSafe(safeName, safeAddress, updateSafe)
      const url = `${SAFELIST_ADDRESS}/${safeAddress}`
      history.push(url)
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while loading the Safe' + error)
    }
  }

  render() {
    const {
      provider, network, userAddress,
    } = this.props

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

export default connect(selector, actions)(Load)
