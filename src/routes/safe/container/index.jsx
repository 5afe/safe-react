// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/components/Layout'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

export type Props = Actions &
  SelectorProps & {
    granted: boolean,
  }

const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 15000

class SafeView extends React.Component<Props> {
  componentDidMount() {
    const {
      fetchSafe, activeTokens, safeUrl, fetchTokenBalances,
    } = this.props

    fetchSafe(safeUrl)
    fetchTokenBalances(safeUrl, activeTokens)

    this.intervalId = setInterval(() => {
      this.checkForUpdates()
    }, TIMEOUT)
  }

  componentDidUpdate(prevProps) {
    const { activeTokens } = this.props
    const oldActiveTokensSize = prevProps.activeTokens.size

    if (oldActiveTokensSize > 0 && activeTokens.size > oldActiveTokensSize) {
      this.checkForUpdates()
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  checkForUpdates() {
    const {
      safeUrl, activeTokens, fetchSafe, fetchTokenBalances,
    } = this.props

    fetchSafe(safeUrl, true)
    fetchTokenBalances(safeUrl, activeTokens)
  }

  intervalId: IntervalID

  render() {
    const {
      safe, provider, activeTokens, granted, userAddress, network, tokens, createTransaction,
    } = this.props

    return (
      <Page>
        <Layout
          activeTokens={activeTokens}
          tokens={tokens}
          provider={provider}
          safe={safe}
          userAddress={userAddress}
          network={network}
          granted={granted}
          createTransaction={createTransaction}
        />
      </Page>
    )
  }
}

export default connect<Object, Object, ?Function, ?Object>(
  selector,
  actions,
)(SafeView)
