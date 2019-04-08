// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/component/Layout'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = Actions &
  SelectorProps & {
    granted: boolean,
  }

const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 15000

class SafeView extends React.PureComponent<Props> {
  componentDidMount() {
    const {
      safeUrl, fetchTokenBalances, fetchSafe, loadActiveTokens, activeTokens,
    } = this.props

    fetchSafe(safeUrl)
    loadActiveTokens(safeUrl)

    if (activeTokens.size) {
      fetchTokenBalances(safeUrl, activeTokens)
    }

    this.intervalId = setInterval(() => {
      // eslint-disable-next-line
      fetchTokenBalances(safeUrl, this.props.activeTokens)
      fetchSafe(safeUrl)
    }, TIMEOUT)
  }

  componentDidUpdate(prevProps) {
    const {
      safe, fetchTokenBalances, loadActiveTokens, activeTokens,
    } = this.props

    if (prevProps.safe) {
      return
    }

    if (safe) {
      const safeAddress = safe.get('address')
      loadActiveTokens(safeAddress)
      if (activeTokens.size) {
        fetchTokenBalances(safeAddress, activeTokens)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  intervalId: IntervalID

  render() {
    const {
      safe, provider, activeTokens, granted, userAddress, network, tokens,
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
        />
      </Page>
    )
  }
}

export default connect<*, *, *, *>(
  selector,
  actions,
)(SafeView)
