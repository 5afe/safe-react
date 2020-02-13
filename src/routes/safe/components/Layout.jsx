// @flow
import React, { useState } from 'react'
import classNames from 'classnames/bind'
import { Switch, Redirect, Route, withRouter } from 'react-router-dom'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import { withStyles } from '@material-ui/core/styles'
import Hairline from '~/components/layout/Hairline'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import Paragraph from '~/components/layout/Paragraph'
import Modal from '~/components/Modal'
import SendModal from './Balances/SendModal'
import Receive from './Balances/Receive'
import NoSafe from '~/components/NoSafe'
import { GenericModal } from '~/components-v2'
import { type SelectorProps } from '~/routes/safe/container/selector'
import { getEtherScanLink, getWeb3 } from '~/logic/wallets/getWeb3'
import { border } from '~/theme/variables'
import { type Actions } from '../container/actions'
import Balances from './Balances'
import Transactions from './Transactions'
import Settings from './Settings'
import { styles } from './style'
import AddressBookTable from '~/routes/safe/components/AddressBook'
import { SettingsIcon } from './assets/SettingsIcon'
import { AddressBookIcon } from './assets/AddressBookIcon'
import { TransactionsIcon } from './assets/TransactionsIcon'
import { BalancesIcon } from './assets/BalancesIcon'

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
    safe,
    provider,
    network,
    classes,
    granted,
    tokens,
    activeTokens,
    blacklistedTokens,
    createTransaction,
    processTransaction,
    activateTokensByBalance,
    fetchTokens,
    updateSafe,
    transactions,
    cancellationTransactions,
    userAddress,
    sendFunds,
    showReceive,
    onShow,
    onHide,
    showSendFunds,
    hideSendFunds,
    match,
    location,
    currencySelected,
    fetchCurrencyValues,
    currencyValues,
    addressBook,
    updateAddressBookEntry,
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

  const { address, ethBalance, name } = safe
  const etherScanLink = getEtherScanLink('address', address)
  const web3Instance = getWeb3()

  const openGenericModal = modalConfig => {
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
  const labelSettings = (
    <>
      <SettingsIcon />
      Settings
    </>
  )
  const labelBalances = (
    <>
      <BalancesIcon />
      Balances
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
        safeAddress={address}
        safeName={name}
        ethBalance={ethBalance}
        web3={web3Instance}
        network={network}
        createTransaction={createTransaction}
        openModal={openGenericModal}
        closeModal={closeGenericModal}
      />
    </React.Suspense>
  )

  return (
    <>
      <Block className={classes.container} margin="xl">
        <Row className={classes.userInfo}>
          <Identicon address={address} diameter={50} />
          <Block className={classes.name}>
            <Row>
              <Heading
                className={classes.nameText}
                tag="h2"
                color="primary"
                testId={SAFE_VIEW_NAME_HEADING_TEST_ID}
              >
                {name}
              </Heading>
              {!granted && (
                <Block className={classes.readonly}>Read Only</Block>
              )}
            </Row>
            <Block justify="center" className={classes.user}>
              <Paragraph
                size="md"
                className={classes.address}
                color="disabled"
                noMargin
              >
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
            <CallMade
              alt="Send Transaction"
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            Send
          </Button>
          <Button
            className={classes.receive}
            color="primary"
            onClick={onShow('Receive')}
            size="small"
            variant="contained"
          >
            <CallReceived
              alt="Receive Transaction"
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            Receive
          </Button>
        </Block>
      </Block>
      <Tabs
        variant="scrollable"
        value={location.pathname}
        onChange={handleCallToRouter}
        indicatorColor="secondary"
        textColor="secondary"
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
            label="Apps"
            value={`${match.url}/apps`}
            data-testid={TRANSACTIONS_TAB_BTN_TEST_ID}
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
          path={`${match.path}/balances`}
          render={() => (
            <Balances
              ethBalance={ethBalance}
              tokens={tokens}
              activeTokens={activeTokens}
              blacklistedTokens={blacklistedTokens}
              granted={granted}
              safeAddress={address}
              activateTokensByBalance={activateTokensByBalance}
              fetchTokens={fetchTokens}
              safeName={name}
              createTransaction={createTransaction}
              currencySelected={currencySelected}
              fetchCurrencyValues={fetchCurrencyValues}
              currencyValues={currencyValues}
            />
          )}
        />
        <Route
          exact
          path={`${match.path}/transactions`}
          render={() => (
            <Transactions
              threshold={safe.threshold}
              owners={safe.owners}
              nonce={safe.nonce}
              transactions={transactions}
              cancellationTransactions={cancellationTransactions}
              safeAddress={address}
              userAddress={userAddress}
              currentNetwork={network}
              granted={granted}
              createTransaction={createTransaction}
              processTransaction={processTransaction}
            />
          )}
        />
        {process.env.REACT_APP_ENV !== 'production' && (
          <Route exact path={`${match.path}/apps`} render={renderAppsTab} />
        )}
        <Route
          exact
          path={`${match.path}/settings`}
          render={() => (
            <Settings
              granted={granted}
              safeAddress={address}
              safeName={name}
              etherScanLink={etherScanLink}
              updateSafe={updateSafe}
              threshold={safe.threshold}
              owners={safe.owners}
              network={network}
              userAddress={userAddress}
              createTransaction={createTransaction}
              safe={safe}
              addressBook={addressBook}
              updateAddressBookEntry={updateAddressBookEntry}
            />
          )}
        />
        <Route
          exact
          path={`${match.path}/address-book`}
          render={() => <AddressBookTable />}
        />
        <Redirect to={`${match.path}/balances`} />
      </Switch>
      <SendModal
        onClose={hideSendFunds}
        isOpen={sendFunds.isOpen}
        safeAddress={address}
        safeName={name}
        ethBalance={ethBalance}
        tokens={activeTokens}
        selectedToken={sendFunds.selectedToken}
        createTransaction={createTransaction}
        activeScreenType="chooseTxType"
      />
      <Modal
        description="Receive Tokens Form"
        handleClose={onHide('Receive')}
        open={showReceive}
        paperClassName={classes.receiveModal}
        title="Receive Tokens"
      >
        <Receive
          safeName={name}
          safeAddress={address}
          onClose={onHide('Receive')}
        />
      </Modal>

      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default withStyles(styles)(withRouter(Layout))
