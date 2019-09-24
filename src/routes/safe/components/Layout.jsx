// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import OpenInNew from '@material-ui/icons/OpenInNew'
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
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import Modal from '~/components/Modal'
import SendModal from './Balances/SendModal'
import Receive from './Balances/Receive'
import NoSafe from '~/components/NoSafe'
import { type SelectorProps } from '~/routes/safe/container/selector'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import {
  secondary, border,
} from '~/theme/variables'
import { copyToClipboard } from '~/utils/clipboard'
import { type Actions } from '../container/actions'
import Balances from './Balances'
import Transactions from './Transactions'
import Settings from './Settings'
import { styles } from './style'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'

type State = {
  tabIndex: number,
}

type Props = SelectorProps &
  Actions & {
    classes: Object,
    granted: boolean,
    sendFunds: Object,
    showReceive: boolean,
    onShow: Function,
    onHide: Function,
    showSendFunds: Function,
    hideSendFunds: Function
  }

const openIconStyle = {
  height: '16px',
  color: secondary,
}

class Layout extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 0,
    }
  }

  handleChange = (event, tabIndex) => {
    this.setState({ tabIndex })
  }

  copyAddress = () => {
    const { safe } = this.props

    if (safe.address) {
      copyToClipboard(safe.address)
    }
  }

  render() {
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
    } = this.props
    const { tabIndex } = this.state

    if (!safe) {
      return <NoSafe provider={provider} text="Safe not found" />
    }

    const { address, ethBalance, name } = safe
    const etherScanLink = getEtherScanLink('address', address, network)

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
            <Block align="center" className={classes.user}>
              <Paragraph size="md" color="disabled" onClick={this.copyAddress} title="Click to copy" noMargin>
                {address}
              </Paragraph>
              <Link className={classes.open} to={etherScanLink} target="_blank">
                <OpenInNew style={openIconStyle} />
              </Link>
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
                testId="balance-send-btn"
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
          <Tabs value={tabIndex} onChange={this.handleChange} indicatorColor="secondary" textColor="secondary">
            <Tab label="Balances" data-testid={BALANCES_TAB_BTN_TEST_ID} />
            <Tab label="Transactions" data-testid={TRANSACTIONS_TAB_BTN_TEST_ID} />
            <Tab label="Settings" data-testid={SETTINGS_TAB_BTN_TEST_ID} />
          </Tabs>
        </Row>
        <Hairline color={border} style={{ marginTop: '-2px' }} />
        {tabIndex === 0 && (
          <Balances
            ethBalance={ethBalance}
            tokens={tokens}
            activeTokens={activeTokens}
            granted={granted}
            safeAddress={address}
            safeName={name}
            etherScanLink={etherScanLink}
            createTransaction={createTransaction}
          />
        )}
        {tabIndex === 1 && (
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
        {tabIndex === 2 && (
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
        <SendModal
          onClose={hideSendFunds}
          isOpen={sendFunds.isOpen}
          etherScanLink={etherScanLink}
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
        >
          <Receive
            safeName={name}
            safeAddress={address}
            etherScanLink={etherScanLink}
            onClose={onHide('Receive')}
          />
        </Modal>
      </>
    )
  }
}

export default withStyles(styles)(Layout)
