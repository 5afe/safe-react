// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/component/Layout'
import NoRights from '~/routes/safe/component/NoRights'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = Actions & SelectorProps & {
  granted: boolean,
}

const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 15000

class SafeView extends React.PureComponent<Props> {
  componentDidMount() {
    this.intervalId = setInterval(() => {
      const { safe, fetchTokens, fetchSafe } = this.props
      if (!safe) {
        return
      }
      const safeAddress = safe.get('address')
      fetchTokens(safeAddress)
      fetchSafe(safe)
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
      safe, provider, tokens, granted, userAddress,
    } = this.props

    return (
      <Page>
        { granted
          ? <Layout tokens={tokens} provider={provider} safe={safe} userAddress={userAddress} />
          : <NoRights />
        }
      </Page>
    )
  }
}

export default connect(selector, actions)(SafeView)
