// 
import * as React from 'react'
import { connect } from 'react-redux'

import actions, { } from './actions'
import selector, { } from './selector'

import Page from '~/components/layout/Page'
import { } from '~/logic/tokens/store/model/token'
import Layout from '~/routes/safe/components/Layout'




const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 5000

class SafeView extends React.Component {
  state = {
    sendFunds: {
      isOpen: false,
      selectedToken: undefined,
    },
    showReceive: false,
  }

  intervalId

  longIntervalId

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

  onShow = (action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  showSendFunds = (token) => {
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
    const {
      activateAssetsByBalance,
      activateTokensByBalance,
      activeTokens,
      addressBook,
      blacklistedTokens,
      cancellationTransactions,
      createTransaction,
      currencySelected,
      currencyValues,
      fetchCurrencyValues,
      fetchTokens,
      granted,
      network,
      processTransaction,
      provider,
      safe,
      tokens,
      transactions,
      updateAddressBookEntry,
      updateSafe,
      userAddress,
    } = this.props

    return (
      <Page>
        <Layout
          activateAssetsByBalance={activateAssetsByBalance}
          activateTokensByBalance={activateTokensByBalance}
          activeTokens={activeTokens}
          addressBook={addressBook}
          blacklistedTokens={blacklistedTokens}
          cancellationTransactions={cancellationTransactions}
          createTransaction={createTransaction}
          currencySelected={currencySelected}
          currencyValues={currencyValues}
          fetchCurrencyValues={fetchCurrencyValues}
          fetchTokens={fetchTokens}
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
          tokens={tokens}
          transactions={transactions}
          updateAddressBookEntry={updateAddressBookEntry}
          updateSafe={updateSafe}
          userAddress={userAddress}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(SafeView)
