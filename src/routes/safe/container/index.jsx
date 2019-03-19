// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/component/Layout'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = Actions & SelectorProps & {
  granted: boolean,
}

const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 15000

class SafeView extends React.PureComponent<Props> {
  componentDidMount() {
    const { safeUrl, fetchTokens, fetchSafe } = this.props
    fetchSafe(safeUrl)
    fetchTokens(safeUrl)

    this.intervalId = setInterval(() => {
      fetchTokens(safeUrl)
      fetchSafe(safeUrl)
    }, TIMEOUT)
  }

  componentDidUpdate(prevProps) {
    const { safe, fetchTokens } = this.props

    if (prevProps.safe) {
      return
    }

    if (safe) {
      const safeAddress = safe.get('address')
      fetchTokens(safeAddress)
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

export default connect(selector, actions)(SafeView)
