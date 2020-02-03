// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import {
  Switch, Redirect, Route, withRouter,
} from 'react-router-dom'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import { withStyles } from '@material-ui/core/styles'
import ImportContactsIcon from '@material-ui/icons/ImportContacts'
import SettingsIcon from '@material-ui/icons/Settings'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import AssessmentIcon from '@material-ui/icons/Assessment'
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
import { type SelectorProps } from '~/routes/safe/container/selector'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { border } from '~/theme/variables'
import { type Actions } from '../container/actions'
import Balances from './Balances'
import Transactions from './Transactions'
import Settings from './Settings'
import { styles } from './style'
import AddressBookTable from '~/routes/safe/components/AddressBook'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'

type Props = SelectorProps &
  Actions & {
    classes: Object,
    fetchCurrencyValues: Function,
    granted: boolean,
    hideSendFunds: Function,
    history: Object,
    location: Object,
    match: Object,
    onHide: Function,
    onShow: Function,
    sendFunds: Object,
    showReceive: boolean,
    showSendFunds: Function,
    updateAddressBookEntry: Function,
  }

const Layout = (props: Props) => {
  const {
    activateTokensByBalance,
    activeTokens,
    addressBook,
    blacklistedTokens,
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

  const handleCallToRouter = (_, value) => {
    const { history } = props

    history.push(value)
  }

  if (!safe) {
    return <NoSafe provider={provider} text="Safe not found" />
  }

  const { address, ethBalance, name } = safe
  const etherScanLink = getEtherScanLink('address', address)

  const labelAddressBook = (
    <>
      <ImportContactsIcon />
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
      <AssessmentIcon />
      Balances
    </>
  )
  const labelTransactions = (
    <>
      <SwapHorizIcon />
      Transactions
    </>
  )

  return (
    <>
      <Block className={classes.container} margin="xl">
        <Identicon address={address} diameter={50} />
        <Block className={classes.name}>
          <Row>
            <Heading tag="h2" color="primary" testId={SAFE_VIEW_NAME_HEADING_TEST_ID}>
              {name}
            </Heading>
            {!granted && <Block className={classes.readonly}>Read Only</Block>}
          </Row>
          <Block justify="center" className={classes.user}>
            <Paragraph size="md" className={classes.address} color="disabled" noMargin>
              {address}
            </Paragraph>
            <CopyBtn content={address} />
            <EtherscanBtn type="address" value={address} />
          </Block>
        </Block>
        <Block className={classes.balance}>
          <Row align="end" className={classes.actions}>
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
          </Row>
        </Block>
      </Block>
      <Row>
        <Tabs
          indicatorColor="secondary"
          onChange={handleCallToRouter}
          textColor="secondary"
          value={location.pathname}
        >
          <Tab
            classes={{
              wrapper: classes.tabWrapper,
            }}
            data-testid={BALANCES_TAB_BTN_TEST_ID}
            label={labelBalances}
            value={`${match.url}/balances`}
          />
          <Tab
            classes={{
              wrapper: classes.tabWrapper,
            }}
            data-testid={TRANSACTIONS_TAB_BTN_TEST_ID}
            label={labelTransactions}
            value={`${match.url}/transactions`}
          />
          <Tab
            classes={{
              wrapper: classes.tabWrapper,
            }}
            data-testid={ADDRESS_BOOK_TAB_BTN_TEST_ID}
            label={labelAddressBook}
            value={`${match.url}/address-book`}
          />
          <Tab
            classes={{
              wrapper: classes.tabWrapper,
            }}
            data-testid={SETTINGS_TAB_BTN_TEST_ID}
            label={labelSettings}
            value={`${match.url}/settings`}
          />
        </Tabs>
      </Row>
      <Hairline color={border} style={{ marginTop: '-2px' }} />
      <Switch>
        <Route
          exact
          path={`${match.path}/balances`}
          render={() => (
            <Balances
              activateTokensByBalance={activateTokensByBalance}
              activeTokens={activeTokens}
              blacklistedTokens={blacklistedTokens}
              createTransaction={createTransaction}
              currencySelected={currencySelected}
              currencyValues={currencyValues}
              ethBalance={ethBalance}
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
        <Route
          exact
          path={`${match.path}/address-book`}
          render={() => (
            <AddressBookTable />
          )}
        />
        <Redirect to={`${match.path}/balances`} />
      </Switch>
      <SendModal
        activeScreenType="chooseTxType"
        createTransaction={createTransaction}
        ethBalance={ethBalance}
        isOpen={sendFunds.isOpen}
        onClose={hideSendFunds}
        safeAddress={address}
        safeName={name}
        selectedToken={sendFunds.selectedToken}
        tokens={activeTokens}
      />
      <Modal
        description="Receive Tokens Form"
        handleClose={onHide('Receive')}
        open={showReceive}
        paperClassName={classes.receiveModal}
        title="Receive Tokens"
      >
        <Receive safeName={name} safeAddress={address} onClose={onHide('Receive')} />
      </Modal>
    </>
  )
}

export default withStyles(styles)(withRouter(Layout))
