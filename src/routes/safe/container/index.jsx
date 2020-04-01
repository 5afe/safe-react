// @flow
import * as React from 'react'
import { connect } from 'react-redux'

import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'

import Page from '~/components/layout/Page'
import { type Token } from '~/logic/tokens/store/model/token'
import Layout from '~/routes/safe/components/Layout'

type State = {
  showReceive: boolean,
  sendFunds: Object,
}

type Action = 'Send' | 'Receive'

export type Props = Actions & SelectorProps

const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 5000

class SafeView extends React.Component<Props, State> {
  state = {
    sendFunds: {
      isOpen: false,
      selectedToken: undefined,
    },
    showReceive: false,
  }

  intervalId: IntervalID

  longIntervalId: IntervalID

  componentDidMount() {
    const {
      activeTokens,
      addViewedSafe,
      fetchCollectibles,
      fetchCurrencyValues,
      fetchLatestMasterContractVersion,
      fetchSafe,
      fetchTokenBalances,
      fetchTokens,
      fetchTransactions,
      loadAddressBook,
      safeUrl,
    } = this.props

    fetchLatestMasterContractVersion()
      .then(() => fetchSafe(safeUrl))
      .then(() => {
        // The safe needs to be loaded before fetching the transactions
        fetchTransactions(safeUrl)
        addViewedSafe(safeUrl)
        fetchCollectibles()
      })
    fetchTokenBalances(safeUrl, activeTokens)
    // fetch tokens there to get symbols for tokens in TXs list
    fetchTokens()
    fetchCurrencyValues(safeUrl)
    loadAddressBook()

    this.intervalId = setInterval(() => {
      this.checkForUpdates()
    }, TIMEOUT)

    this.longIntervalId = setInterval(() => {
      fetchCollectibles()
    }, TIMEOUT * 3)
  }

  componentDidUpdate(prevProps) {
    const { activeTokens, fetchTransactions, safeUrl } = this.props
    const oldActiveTokensSize = prevProps.activeTokens.size

    if (oldActiveTokensSize > 0 && activeTokens.size > oldActiveTokensSize) {
      this.checkForUpdates()
    }

    if (safeUrl !== prevProps.safeUrl) {
      fetchTransactions(safeUrl)
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
    clearInterval(this.longIntervalId)
  }

  onShow = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  showSendFunds = (token: Token) => {
    this.setState({
      sendFunds: {
        isOpen: true,
        selectedToken: token,
      },
    })
  }

  hideSendFunds = () => {
    this.setState({
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
    })
  }

  checkForUpdates() {
    const {
      activeTokens,
      checkAndUpdateSafeOwners,
      fetchEtherBalance,
      fetchTokenBalances,
      fetchTransactions,
      safe,
      safeUrl,
    } = this.props
    checkAndUpdateSafeOwners(safeUrl)
    fetchTokenBalances(safeUrl, activeTokens)
    fetchEtherBalance(safe)
    fetchTransactions(safeUrl)
  }

  render() {
    const { sendFunds, showReceive } = this.state

    return (
      <Page>
        <Layout
          hideSendFunds={this.hideSendFunds}
          onHide={this.onHide}
          onShow={this.onShow}
          sendFunds={sendFunds}
          showReceive={showReceive}
          showSendFunds={this.showSendFunds}
        />
      </Page>
    )
  }
}

export default connect<Object, Object, ?Function, ?Object>(selector, actions)(SafeView)
