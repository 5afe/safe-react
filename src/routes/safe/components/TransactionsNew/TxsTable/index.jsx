// @flow
import * as React from 'react'
import { List } from 'immutable'
import classNames from 'classnames/bind'
import { type Token } from '~/logic/tokens/store/model/token'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Modal from '~/components/Modal'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import {
  getBalanceData, generateColumns, BALANCE_TABLE_ASSET_ID, type BalanceRow, filterByZero,
} from './dataFetcher'
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
  state = {
    hideZero: false,
    showToken: false,
    sendFunds: {
      isOpen: false,
      selectedToken: undefined,
    },
    showReceive: false,
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
    const autoColumns = columns.filter(c => !c.custom)
    const checkboxClasses = {
      root: classes.root,
    }

    const filteredData = filterByZero(getBalanceData(activeTokens), hideZero)

    return (
      <React.Fragment>
        <Table
          label="Balances"
          defaultOrderBy={BALANCE_TABLE_ASSET_ID}
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
                      color="secondary"
                      className={classes.send}
                      onClick={() => this.showSendFunds(row.asset.name)}
                      data-testid="balance-send-btn"
                    >
                      <CallMade className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Send
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    className={classes.receive}
                    onClick={this.onShow('Receive')}
                  >
                    <CallReceived className={classNames(classes.leftIcon, classes.iconSmall)} />
                      Receive
                  </Button>
                </Row>
              </TableCell>
            </TableRow>
          ))
          }
        </Table>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Balances)
