// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'
import Hairline from '~/components/layout/Hairline'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import NoSafe from '~/components/NoSafe'
import { type SelectorProps } from '~/routes/safe/container/selector'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import {
  sm, xs, secondary, smallFontSize,
} from '~/theme/variables'
import { copyToClipboard } from '~/utils/clipboard'
import Balances from './Balances'
import Transactions from './TransactionsNew'
import Settings from './Settings'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'

type State = {
  tabIndex: number,
}

type Props = SelectorProps & {
  classes: Object,
  granted: boolean,
  updateSafe: Function,
  createTransaction: Function,
  processTransaction: Function,
  fetchTransactions: Function,
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
    backgroundColor: '#a2a8ba',
    fontFamily: 'Roboto Mono, monospace',
    textTransform: 'uppercase',
    padding: `0 ${sm}`,
    marginLeft: sm,
    borderRadius: xs,
    lineHeight: '28px',
  },
})

class Layout extends React.Component<Props, State> {
  state = {
    tabIndex: 0,
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
    } = this.props
    const { tabIndex } = this.state

    if (!safe) {
      return <NoSafe provider={provider} text="Safe not found" />
    }

    const { address, ethBalance, name } = safe
    const etherScanLink = getEtherScanLink('address', address, network)

    return (
      <React.Fragment>
        <Block className={classes.container} margin="xl">
          <Identicon address={address} diameter={50} />
          <Block className={classes.name}>
            <Row>
              <Heading tag="h2" color="secondary" testId={SAFE_VIEW_NAME_HEADING_TEST_ID}>
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
        </Block>
        <Row>
          <Tabs value={tabIndex} onChange={this.handleChange} indicatorColor="secondary" textColor="secondary">
            <Tab label="Balances" data-testid={BALANCES_TAB_BTN_TEST_ID} />
            <Tab label="Transactions" data-testid={TRANSACTIONS_TAB_BTN_TEST_ID} />
            <Tab label="Settings" data-testid={SETTINGS_TAB_BTN_TEST_ID} />
          </Tabs>
        </Row>
        <Hairline color="#c8ced4" />
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
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Layout)
