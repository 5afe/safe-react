// @flow
import Badge from '@material-ui/core/Badge'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { withStyles } from '@material-ui/core/styles'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import classNames from 'classnames/bind'
import React, { useState } from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'

import { type Actions } from '../container/actions'

import Balances from './Balances'
import Receive from './Balances/Receive'
import Settings from './Settings'
import Transactions from './Transactions'
import { AddressBookIcon } from './assets/AddressBookIcon'
import { AppsIcon } from './assets/AppsIcon'
import { BalancesIcon } from './assets/BalancesIcon'
import { SettingsIcon } from './assets/SettingsIcon'
import { TransactionsIcon } from './assets/TransactionsIcon'
import { styles } from './style'

import { GenericModal } from '~/components-v2'
import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import Modal from '~/components/Modal'
import NoSafe from '~/components/NoSafe'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { getEtherScanLink, getWeb3 } from '~/logic/wallets/getWeb3'
import AddressBookTable from '~/routes/safe/components/AddressBook'
import SendModal from '~/routes/safe/components/Balances/SendModal'
import { type SelectorProps } from '~/routes/safe/container/selector'
import { border } from '~/theme/variables'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'

const Apps = React.lazy(() => import('./Apps'))

type Props = SelectorProps &
  Actions & {
    classes: Object,
    granted: boolean,
    sendFunds: Object,
    showReceive: boolean,
    onShow: Function,
    onHide: Function,
    showSendFunds: Function,
    hideSendFunds: Function,
    match: Object,
    location: Object,
    history: Object,
    fetchCurrencyValues: Function,
    updateAddressBookEntry: Function,
  }

const Layout = (props: Props) => {
  const {
    activateAssetsByBalance,
    activateTokensByBalance,
    activeTokens,
    addressBook,
    blacklistedTokens,
    cancellationTransactions,
    classes,
    createTransaction,
    currencySelected,
    currencyValues,
    fetchCurrencyValues,
    fetchTokens,
    granted,
    hideSendFunds,
    location,
    match,
    network,
    onHide,
    onShow,
    processTransaction,
    provider,
    safe,
    sendFunds,
    showReceive,
    showSendFunds,
    tokens,
    transactions,
    updateAddressBookEntry,
    updateSafe,
    userAddress,
  } = props

  const [modal, setModal] = useState({
    isOpen: false,
    title: null,
    body: null,
    footer: null,
    onClose: null,
  })

  const handleCallToRouter = (_, value) => {
    const { history } = props

    history.push(value)
  }

  if (!safe) {
    return <NoSafe provider={provider} text="Safe not found" />
  }

  const { address, ethBalance, featuresEnabled, name } = safe
  const etherScanLink = getEtherScanLink('address', address)
  const web3Instance = getWeb3()

  const openGenericModal = (modalConfig) => {
    setModal({ ...modalConfig, isOpen: true })
  }

  const closeGenericModal = () => {
    if (modal.onClose) {
      modal.onClose()
    }

    setModal({
      isOpen: false,
      title: null,
      body: null,
      footer: null,
      onClose: null,
    })
  }

  const labelAddressBook = (
    <>
      <AddressBookIcon />
      Address Book
    </>
  )

  const labelApps = (
    <>
      <AppsIcon />
      Apps
    </>
  )

  const labelSettings = (
    <>
      <SettingsIcon />
      <Badge
        badgeContent=""
        color="error"
        invisible={!safe.needsUpdate || !granted}
        style={{ paddingRight: '10px' }}
        variant="dot"
      >
        Settings
      </Badge>
    </>
  )
  const labelBalances = (
    <>
      <BalancesIcon />
      Assets
    </>
  )
  const labelTransactions = (
    <>
      <TransactionsIcon />
      Transactions
    </>
  )

  const renderAppsTab = () => (
    <React.Suspense>
      <Apps
        closeModal={closeGenericModal}
        createTransaction={createTransaction}
        ethBalance={ethBalance}
        granted={granted}
        network={network}
        openModal={openGenericModal}
        safeAddress={address}
        safeName={name}
        web3={web3Instance}
      />
    </React.Suspense>
  )

  const tabsValue = () => {
    const balanceLocation = `${match.url}/balances`
    const isInBalance = new RegExp(`^${balanceLocation}.*$`)
    const { pathname } = location

    if (isInBalance.test(pathname)) {
      return balanceLocation
    }

    return pathname
  }

  return (
    <>
      <Block className={classes.container} margin="xl">
        <Row className={classes.userInfo}>
          <Identicon address={address} diameter={50} />
          <Block className={classes.name}>
            <Row>
              <Heading className={classes.nameText} color="primary" tag="h2" testId={SAFE_VIEW_NAME_HEADING_TEST_ID}>
                {name}
              </Heading>
              {!granted && <Block className={classes.readonly}>Read Only</Block>}
            </Row>
            <Block className={classes.user} justify="center">
              <Paragraph className={classes.address} color="disabled" noMargin size="md">
                {address}
              </Paragraph>
              <CopyBtn content={address} />
              <EtherscanBtn type="address" value={address} />
            </Block>
          </Block>
        </Row>
        <Block className={classes.balance}>
          <Button
            className={classes.send}
            color="primary"
            disabled={!granted}
            onClick={() => showSendFunds('Ether')}
            size="small"
            variant="contained"
          >
            <CallMade alt="Send Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
            Send
          </Button>
          <Button
            className={classes.receive}
            color="primary"
            onClick={onShow('Receive')}
            size="small"
            variant="contained"
          >
            <CallReceived alt="Receive Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
            Receive
          </Button>
        </Block>
      </Block>
      <Tabs
        indicatorColor="secondary"
        onChange={handleCallToRouter}
        textColor="secondary"
        value={tabsValue()}
        variant="scrollable"
      >
        <Tab
          classes={{
            selected: classes.tabWrapperSelected,
            wrapper: classes.tabWrapper,
          }}
          data-testid={BALANCES_TAB_BTN_TEST_ID}
          label={labelBalances}
          value={`${match.url}/balances`}
        />
        <Tab
          classes={{
            selected: classes.tabWrapperSelected,
            wrapper: classes.tabWrapper,
          }}
          data-testid={TRANSACTIONS_TAB_BTN_TEST_ID}
          label={labelTransactions}
          value={`${match.url}/transactions`}
        />
        {process.env.REACT_APP_ENV !== 'production' && (
          <Tab
            classes={{
              selected: classes.tabWrapperSelected,
              wrapper: classes.tabWrapper,
            }}
            data-testid={TRANSACTIONS_TAB_BTN_TEST_ID}
            label={labelApps}
            value={`${match.url}/apps`}
          />
        )}
        <Tab
          classes={{
            selected: classes.tabWrapperSelected,
            wrapper: classes.tabWrapper,
          }}
          data-testid={ADDRESS_BOOK_TAB_BTN_TEST_ID}
          label={labelAddressBook}
          value={`${match.url}/address-book`}
        />
        <Tab
          classes={{
            selected: classes.tabWrapperSelected,
            wrapper: classes.tabWrapper,
          }}
          data-testid={SETTINGS_TAB_BTN_TEST_ID}
          label={labelSettings}
          value={`${match.url}/settings`}
        />
      </Tabs>
      <Hairline color={border} style={{ marginTop: '-2px' }} />
      <Switch>
        <Route
          exact
          path={`${match.path}/balances/:assetType?`}
          render={() => (
            <Balances
              activateAssetsByBalance={activateAssetsByBalance}
              activateTokensByBalance={activateTokensByBalance}
              activeTokens={activeTokens}
              blacklistedTokens={blacklistedTokens}
              currencySelected={currencySelected}
              currencyValues={currencyValues}
              featuresEnabled={featuresEnabled}
              fetchCurrencyValues={fetchCurrencyValues}
              fetchTokens={fetchTokens}
              granted={granted}
              safeAddress={address}
              safeName={name}
              tokens={tokens}
            />
          )}
        />
        <Route
          exact
          path={`${match.path}/transactions`}
          render={() => (
            <Transactions
              cancellationTransactions={cancellationTransactions}
              createTransaction={createTransaction}
              currentNetwork={network}
              granted={granted}
              nonce={safe.nonce}
              owners={safe.owners}
              processTransaction={processTransaction}
              safeAddress={address}
              threshold={safe.threshold}
              transactions={transactions}
              userAddress={userAddress}
            />
          )}
        />
        <Route exact path={`${match.path}/apps`} render={renderAppsTab} />
        <Route
          exact
          path={`${match.path}/settings`}
          render={() => (
            <Settings
              addressBook={addressBook}
              createTransaction={createTransaction}
              etherScanLink={etherScanLink}
              granted={granted}
              network={network}
              owners={safe.owners}
              safe={safe}
              safeAddress={address}
              safeName={name}
              threshold={safe.threshold}
              updateAddressBookEntry={updateAddressBookEntry}
              updateSafe={updateSafe}
              userAddress={userAddress}
            />
          )}
        />
        <Route exact path={`${match.path}/address-book`} render={() => <AddressBookTable />} />
        <Redirect to={`${match.path}/balances`} />
      </Switch>
      <SendModal
        activeScreenType="chooseTxType"
        isOpen={sendFunds.isOpen}
        onClose={hideSendFunds}
        selectedToken={sendFunds.selectedToken}
      />
      <Modal
        description="Receive Tokens Form"
        handleClose={onHide('Receive')}
        open={showReceive}
        paperClassName={classes.receiveModal}
        title="Receive Tokens"
      >
        <Receive onClose={onHide('Receive')} safeAddress={address} safeName={name} />
      </Modal>

      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default withStyles(styles)(withRouter(Layout))
