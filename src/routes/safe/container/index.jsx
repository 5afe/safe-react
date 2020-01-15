// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/components/Layout'
import { type Token } from '~/logic/tokens/store/model/token'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

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

  componentDidMount() {
    const {
      fetchSafe, activeTokens, safeUrl, fetchTokenBalances, fetchTokens, fetchTransactions, fetchCurrencyValues, loadAddressBook,
    } = this.props

    fetchSafe(safeUrl).then(() => {
      // The safe needs to be loaded before fetching the transactions
      fetchTransactions(safeUrl)
    })
    fetchTokenBalances(safeUrl, activeTokens)
    // fetch tokens there to get symbols for tokens in TXs list
    fetchTokens()
    fetchCurrencyValues(safeUrl)
    loadAddressBook()

    this.intervalId = setInterval(() => {
      this.checkForUpdates()
    }, TIMEOUT)
  }

  componentDidUpdate(prevProps) {
    const { activeTokens, safeUrl, fetchTransactions } = this.props
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
      safeUrl,
      activeTokens,
      fetchTokenBalances,
      fetchEtherBalance,
      fetchTransactions,
      checkAndUpdateSafeOwners,
    } = this.props
    checkAndUpdateSafeOwners(safeUrl)
    fetchTokenBalances(safeUrl, activeTokens)
    fetchEtherBalance(safeUrl)
    fetchTransactions(safeUrl)
  }

  render() {
    const { sendFunds, showReceive } = this.state
    const {
      safe,
      provider,
      activeTokens,
      blacklistedTokens,
      granted,
      userAddress,
      network,
      tokens,
      createTransaction,
      processTransaction,
      activateTokensByBalance,
      fetchTokens,
      updateSafe,
      transactions,
      currencySelected,
      fetchCurrencyValues,
      currencyValues,
      addressBook,
      updateAddressBookEntry,
    } = this.props

    return (
      <Page>
        <Layout
          activeTokens={activeTokens}
          blacklistedTokens={blacklistedTokens}
          tokens={tokens}
          provider={provider}
          safe={safe}
          userAddress={userAddress}
          network={network}
          granted={granted}
          createTransaction={createTransaction}
          processTransaction={processTransaction}
          activateTokensByBalance={activateTokensByBalance}
          fetchTokens={fetchTokens}
          updateSafe={updateSafe}
          transactions={transactions}
          sendFunds={sendFunds}
          showReceive={showReceive}
          onShow={this.onShow}
          onHide={this.onHide}
          showSendFunds={this.showSendFunds}
          hideSendFunds={this.hideSendFunds}
          currencySelected={currencySelected}
          fetchCurrencyValues={fetchCurrencyValues}
          currencyValues={currencyValues}
          addressBook={addressBook}
          updateAddressBookEntry={updateAddressBookEntry}
        />
      </Page>
    )
  }
}

export default connect<Object, Object, ?Function, ?Object>(
  selector,
  actions,
)(SafeView)
