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

class SafeView extends React.PureComponent<Props> {
  componentDidMount() {
    console.log("componentDidMount 1")
    this.intervalId = setInterval(() => {
      const { safe, fetchBalances, fetchSafe } = this.props
      if (!safe) {
        return
      }
      const safeAddress = safe.get('address')
      fetchBalances(safeAddress)
      fetchSafe(safe)
    }, 1500)
    console.log("componentDidMount 2")
  }

  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate 1")
    if (prevProps.safe) {
      return
    }
    console.log("componentDidUpdate 2")
    if (this.props.safe) {
      console.log("componentDidUpdate 2A")
      const safeAddress = this.props.safe.get('address')
      this.props.fetchBalances(safeAddress)
    }
    console.log("componentDidUpdate 2B")
  }

  componentWillUnmount() {
    console.log("componentWillUnmount")
    clearInterval(this.intervalId)
  }

  intervalId: IntervalID

  render() {
    const {
      safe, provider, balances, granted, userAddress,
    } = this.props
    console.log("Rendering.... CONTAINER")

    return (
      <Page>
        { granted
          ? <Layout balances={balances} provider={provider} safe={safe} userAddress={userAddress} />
          : <NoRights />
        }
      </Page>
    )
  }
}

export default connect(selector, actions)(SafeView)
