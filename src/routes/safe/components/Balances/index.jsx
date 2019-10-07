// @flow
import * as React from 'react'
import { List } from 'immutable'
import classNames from 'classnames/bind'
import Checkbox from '@material-ui/core/Checkbox'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import { type Token } from '~/logic/tokens/store/model/token'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import ButtonLink from '~/components/layout/ButtonLink'
import Paragraph from '~/components/layout/Paragraph'
import Modal from '~/components/Modal'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import {
  getBalanceData, generateColumns, BALANCE_TABLE_ASSET_ID, type BalanceRow, filterByZero,
} from './dataFetcher'
import AssetTableCell from './AssetTableCell'
import Tokens from './Tokens'
import SendModal from './SendModal'
import Receive from './Receive'
import { styles } from './style'

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

type State = {
  hideZero: boolean,
  showToken: boolean,
  showReceive: boolean,
  sendFunds: Object,
}

type Props = {
  classes: Object,
  granted: boolean,
  tokens: List<Token>,
  activeTokens: List<Token>,
  safeAddress: string,
  safeName: string,
  etherScanLink: string,
  ethBalance: string,
  createTransaction: Function,
}

type Action = 'Token' | 'Send' | 'Receive'

class Balances extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      hideZero: false,
      showToken: false,
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
      showReceive: false,
    }
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

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { checked } = e.target

    this.setState(() => ({ hideZero: checked }))
  }

  render() {
    const {
      hideZero, showToken, showReceive, sendFunds,
    } = this.state
    const {
      classes,
      granted,
      tokens,
      safeAddress,
      activeTokens,
      safeName,
      etherScanLink,
      ethBalance,
      createTransaction,
    } = this.props

    const columns = generateColumns()
    const autoColumns = columns.filter((c) => !c.custom)
    const checkboxClasses = {
      root: classes.root,
    }

    const filteredData = filterByZero(getBalanceData(activeTokens), hideZero)

    return (
      <>
        <Row align="center" className={classes.message}>
          <Col xs={6}>
            <Checkbox
              classes={checkboxClasses}
              checked={hideZero}
              onChange={this.handleChange}
              color="secondary"
              disableRipple
            />
            <Paragraph size="lg">Hide zero balances</Paragraph>
          </Col>
          <Col xs={6} end="sm">
            <ButtonLink size="lg" onClick={this.onShow('Token')} testId="manage-tokens-btn">
              Manage Tokens
            </ButtonLink>
            <Modal
              title="Manage Tokens"
              description="Enable and disable tokens to be listed"
              handleClose={this.onHide('Token')}
              open={showToken}
            >
              <Tokens
                tokens={tokens}
                onClose={this.onHide('Token')}
                safeAddress={safeAddress}
                activeTokens={activeTokens}
              />
            </Modal>
          </Col>
        </Row>
        <Table
          label="Balances"
          defaultOrderBy={BALANCE_TABLE_ASSET_ID}
          defaultRowsPerPage={10}
          columns={columns}
          data={filteredData}
          size={filteredData.size}
          defaultFixed
        >
          {(sortedData: Array<BalanceRow>) => sortedData.map((row: any, index: number) => (
            <TableRow tabIndex={-1} key={index} className={classes.hide} data-testid={BALANCE_ROW_TEST_ID}>
              {autoColumns.map((column: Column) => (
                <TableCell key={column.id} style={cellWidth(column.width)} align={column.align} component="td">
                  {column.id === BALANCE_TABLE_ASSET_ID ? <AssetTableCell asset={row[column.id]} /> : row[column.id]}
                </TableCell>
              ))}
              <TableCell component="td">
                <Row align="end" className={classes.actions}>
                  {granted && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      className={classes.send}
                      onClick={() => this.showSendFunds(row.asset.name)}
                      testId="balance-send-btn"
                    >
                      <CallMade alt="Send Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Send
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    className={classes.receive}
                    onClick={this.onShow('Receive')}
                  >
                    <CallReceived alt="Receive Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
                      Receive
                  </Button>
                </Row>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <SendModal
          onClose={this.hideSendFunds}
          isOpen={sendFunds.isOpen}
          etherScanLink={etherScanLink}
          safeAddress={safeAddress}
          safeName={safeName}
          ethBalance={ethBalance}
          tokens={activeTokens}
          selectedToken={sendFunds.selectedToken}
          createTransaction={createTransaction}
          activeScreenType="sendFunds"
        />
        <Modal
          title="Receive Tokens"
          description="Receive Tokens Form"
          handleClose={this.onHide('Receive')}
          paperClassName={classes.receiveModal}
          open={showReceive}
        >
          <Receive
            safeName={safeName}
            safeAddress={safeAddress}
            onClose={this.onHide('Receive')}
          />
        </Modal>
      </>
    )
  }
}

export default withStyles(styles)(Balances)
