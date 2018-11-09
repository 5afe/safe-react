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
    this.props.fetchSafe(this.props.safeUrl)
    this.props.fetchTokens(this.props.safeUrl)
    this.intervalId = setInterval(() => {
      const { safeUrl, fetchTokens, fetchSafe } = this.props
      fetchTokens(safeUrl)
      fetchSafe(safeUrl)
    }, TIMEOUT)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.safe) {
      return
    }

    if (this.props.safe) {
      const safeAddress = this.props.safe.get('address')
      this.props.fetchTokens(safeAddress)
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
