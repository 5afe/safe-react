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

export type Props = Actions &
  SelectorProps & {
    granted: boolean,
  }

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
      addViewedSafe,
      fetchCollectibles,
      fetchCurrencyValues,
      fetchLatestMasterContractVersion,
      fetchSafe,
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
        fetchCurrencyValues(safeUrl)
        fetchCollectibles()
      })
    // fetch tokens there to get symbols for tokens in TXs list
    fetchTokens()
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
    const { checkAndUpdateSafeOwners, fetchEtherBalance, fetchTransactions, safe, safeUrl } = this.props
    checkAndUpdateSafeOwners(safeUrl)
    fetchEtherBalance(safe)
    fetchTransactions(safeUrl)
  }

  render() {
    const { sendFunds, showReceive } = this.state
    const {
      addressBook,
      cancellationTransactions,
      createTransaction,
      granted,
      network,
      processTransaction,
      provider,
      safe,
      transactions,
      updateAddressBookEntry,
      updateSafe,
      userAddress,
    } = this.props

    return (
      <Page>
        <Layout
          addressBook={addressBook}
          cancellationTransactions={cancellationTransactions}
          createTransaction={createTransaction}
          granted={granted}
          hideSendFunds={this.hideSendFunds}
          network={network}
          onHide={this.onHide}
          onShow={this.onShow}
          processTransaction={processTransaction}
          provider={provider}
          safe={safe}
          sendFunds={sendFunds}
          showReceive={showReceive}
          showSendFunds={this.showSendFunds}
          transactions={transactions}
          updateAddressBookEntry={updateAddressBookEntry}
          updateSafe={updateSafe}
          userAddress={userAddress}
        />
      </Page>
    )
  }
}

export default connect<Object, Object, ?Function, ?Object>(selector, actions)(SafeView)
