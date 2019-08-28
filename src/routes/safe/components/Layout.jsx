// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'
import Hairline from '~/components/layout/Hairline'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import Img from '~/components/layout/Img'
import Modal from '~/components/Modal'
import SendModal from './Balances/SendModal'
import Receive from './Balances/Receive'
import NoSafe from '~/components/NoSafe'
import { type SelectorProps } from '~/routes/safe/container/selector'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import {
  sm, xs, secondary, smallFontSize, border, secondaryText,
} from '~/theme/variables'
import { copyToClipboard } from '~/utils/clipboard'
import { type Actions } from '../container/actions'
import Balances from './Balances'
import Transactions from './Transactions'
import Settings from './Settings'
import { styles } from './style'

const ReceiveTx = require('./assets/tx-receive.svg')
const SendTx = require('./assets/tx-send.svg')

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

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: sm,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  user: {
    justifyContent: 'left',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  readonly: {
    fontSize: smallFontSize,
    letterSpacing: '0.5px',
    color: '#ffffff',
    backgroundColor: secondaryText,
    textTransform: 'uppercase',
    padding: `0 ${sm}`,
    marginLeft: sm,
    borderRadius: xs,
    lineHeight: '28px',
  },
})

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
                className={classes.receive}
                onClick={onShow('Receive')}
                rounded
              >
                <Img src={ReceiveTx} alt="Receive Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
                  Receive
              </Button>
              {granted && (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  className={classes.send}
                  onClick={() => showSendFunds('Ether')}
                  rounded
                  testId="balance-send-btn"
                >
                  <Img src={SendTx} alt="Send Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Send
                </Button>
              )}
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
      </>
    )
  }
}

export default withStyles(styles)(Layout)
