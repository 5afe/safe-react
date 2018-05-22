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

class SafeView extends React.PureComponent<Props> {
  componentDidMount() {
    this.intervalId = setInterval(() => {
      const { safe, fetchBalance } = this.props
      if (!safe) { return }

      const safeAddress: string = safe.get('address')
      fetchBalance(safeAddress)
    }, 1500)

    const { fetchDailyLimit, safe } = this.props
    if (safe) {
      fetchDailyLimit(safe.get('address'))
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  intervalId: IntervalID

  render() {
    const {
      safe, provider, balance, granted,
    } = this.props

    return (
      <Page>
        { granted && <Layout
          balance={balance}
          provider={provider}
          safe={safe}
        /> }
      </Page>
    )
  }
}

export default connect(selector, actions)(SafeView)
