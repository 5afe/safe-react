// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import selector from './selector'
import actions, { type Actions } from './actions'
import Layout from '../components/Layout'

type Props = Actions & {
  provider: string,
  userAccount: string,
  network: string,
}

export const loadSafe = async (): Promise<void> => {

}

class Open extends React.Component<Props> {
  onLoadSafeSubmit = async () => {
    //
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
