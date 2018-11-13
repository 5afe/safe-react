// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { SAFES_KEY, load, saveSafes } from '~/utils/localStorage'
import selector from './selector'
import actions, { type Actions, type UpdateSafe } from './actions'
import Layout from '../components/Layout'

type Props = Actions & {
  provider: string,
  userAccount: string,
  network: string,
}

export const loadSafe = async (safeName: string, safeAddress: string, updateSafe: UpdateSafe) => {
  const safeRecord = await buildSafe(safeAddress, safeName)

  await updateSafe(safeRecord)

  const storedSafes = load(SAFES_KEY) || {}
  storedSafes[safeAddress] = safeRecord.toJSON()

  saveSafes(storedSafes)
}

class Open extends React.Component<Props> {
  onLoadSafeSubmit = async () => {
    // call loadSafe
    // travel to safe route
  }

  render() {
    const { provider, network } = this.props

    return (
      <Page>
        <Layout
          network={network}
          provider={provider}
          onLoadSafeSubmit={this.onLoadSafeSubmit}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(Open)
