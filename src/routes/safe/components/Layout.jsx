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

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'

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
    createTransaction,
    processTransaction,
    fetchTransactions,
    updateSafe,
    transactions,
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
              variant="contained"
              size="small"
              color="primary"
              className={classes.send}
              onClick={() => showSendFunds('Ether')}
              disabled={!granted}
            >
              <CallMade alt="Send Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
              Send
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              className={classes.receive}
              onClick={onShow('Receive')}
            >
              <CallReceived alt="Receive Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
              Receive
            </Button>
          </Row>
        </Block>
      </Block>
      <Row>
        <Tabs
          value={location.pathname}
          onChange={handleCallToRouter}
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab label="Balances" value={`${match.url}/balances`} data-testid={BALANCES_TAB_BTN_TEST_ID} />
          <Tab label="Transactions" value={`${match.url}/transactions`} data-testid={TRANSACTIONS_TAB_BTN_TEST_ID} />
          <Tab label="Settings" value={`${match.url}/settings`} data-testid={SETTINGS_TAB_BTN_TEST_ID} />
        </Tabs>
      </Row>
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
              granted={granted}
              safeAddress={address}
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
              transactions={transactions}
              fetchTransactions={fetchTransactions}
              safeAddress={address}
              userAddress={userAddress}
              currentNetwork={network}
              granted={granted}
              createTransaction={createTransaction}
              processTransaction={processTransaction}
            />
          )}
        />
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
            />
          )}
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
        title="Receive Tokens"
        description="Receive Tokens Form"
        handleClose={onHide('Receive')}
        open={showReceive}
        paperClassName={classes.receiveModal}
      >
        <Receive safeName={name} safeAddress={address} onClose={onHide('Receive')} />
      </Modal>
    </>
  )
}

export default withStyles(styles)(withRouter(Layout))
