// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/component/Layout'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = Actions & SelectorProps

class SafeView extends React.PureComponent<Props> {
  componentDidMount() {
    this.intervalId = setInterval(() => {
      const { safe, fetchBalance } = this.props
      if (!safe) { return }

      const safeAddress: string = safe.get('address')
      fetchBalance(safeAddress)
    }, 1500)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  intervalId: IntervalID

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
