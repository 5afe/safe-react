// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/component/Layout'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

class SafeView extends React.PureComponent<Actions & SelectorProps> {
  componentDidMount() {
    const { safe, fetchBalance } = this.props
    if (!safe) { return }

    const safeAddress: string = safe.get('address')
    fetchBalance(safeAddress)
  }

  render() {
    const { safe, provider, balance } = this.props

    return (
      <Page>
        <Layout
          balance={balance}
          provider={provider}
          safe={safe}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(SafeView)
