// @flow
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import classNames from 'classnames/bind'
import { List } from 'immutable'
import * as React from 'react'

import AssetTableCell from './AssetTableCell'
import Receive from './Receive'
import SendModal from './SendModal'
import Tokens from './Tokens'
import { BALANCE_TABLE_ASSET_ID, type BalanceRow, generateColumns, getBalanceData } from './dataFetcher'
import { styles } from './style'

import Modal from '~/components/Modal'
import Table from '~/components/Table'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Button from '~/components/layout/Button'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import { type Token } from '~/logic/tokens/store/model/token'
import { BALANCE_TABLE_BALANCE_ID, BALANCE_TABLE_VALUE_ID } from '~/routes/safe/components/Balances/dataFetcher'
import DropdownCurrency from '~/routes/safe/components/DropdownCurrency'

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

type State = {
  showToken: boolean,
  showReceive: boolean,
  sendFunds: Object,
}

type Props = {
  classes: Object,
  granted: boolean,
  tokens: List<Token>,
  activeTokens: List<Token>,
  blacklistedTokens: List<Token>,
  activateTokensByBalance: Function,
  fetchTokens: Function,
  safeAddress: string,
  safeName: string,
  ethBalance: string,
  createTransaction: Function,
  currencySelected: string,
  fetchCurrencyValues: Function,
  currencyValues: BalanceCurrencyType[],
}

type Action = 'Token' | 'Send' | 'Receive'

class Balances extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      showToken: false,
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
      showReceive: false,
    }
    props.fetchTokens()
  }

  componentDidMount(): void {
    const { activateTokensByBalance, fetchCurrencyValues, safeAddress } = this.props
    fetchCurrencyValues(safeAddress)
    activateTokensByBalance(safeAddress)
  }

  onShow = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  showSendFunds = (tokenAddress: string) => {
    this.setState({
      sendFunds: {
        isOpen: true,
        selectedToken: tokenAddress,
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

  render() {
    const { sendFunds, showReceive, showToken } = this.state
    const {
      activeTokens,
      blacklistedTokens,
      classes,
      createTransaction,
      currencySelected,
      currencyValues,
      ethBalance,
      granted,
      safeAddress,
      safeName,
      tokens,
    } = this.props

    const columns = generateColumns()
    const autoColumns = columns.filter(c => !c.custom)

    const filteredData = getBalanceData(activeTokens, currencySelected, currencyValues)

    return (
      <>
        <Row align="center" className={classes.message}>
          <Col end="sm" xs={12}>
            <DropdownCurrency />
            <ButtonLink onClick={this.onShow('Token')} size="lg" testId="manage-tokens-btn">
              Manage List
            </ButtonLink>
            <Modal
              description="Enable and disable tokens to be listed"
              handleClose={this.onHide('Token')}
              open={showToken}
              title="Manage List"
            >
              <Tokens
                activeTokens={activeTokens}
                blacklistedTokens={blacklistedTokens}
                onClose={this.onHide('Token')}
                safeAddress={safeAddress}
                tokens={tokens}
              />
            </Modal>
          </Col>
        </Row>
        <TableContainer>
          <Table
            columns={columns}
            data={filteredData}
            defaultFixed
            defaultOrderBy={BALANCE_TABLE_ASSET_ID}
            defaultRowsPerPage={10}
            label="Balances"
            size={filteredData.size}
          >
            {(sortedData: Array<BalanceRow>) =>
              sortedData.map((row: any, index: number) => (
                <TableRow className={classes.hide} data-testid={BALANCE_ROW_TEST_ID} key={index} tabIndex={-1}>
                  {autoColumns.map((column: Column) => {
                    const { align, id, width } = column
                    let cellItem
                    switch (id) {
                      case BALANCE_TABLE_ASSET_ID: {
                        cellItem = <AssetTableCell asset={row[id]} />
                        break
                      }
                      case BALANCE_TABLE_BALANCE_ID: {
                        cellItem = <div>{row[id]}</div>
                        break
                      }
                      case BALANCE_TABLE_VALUE_ID: {
                        cellItem = <div className={classes.currencyValueRow}>{row[id]}</div>
                        break
                      }
                      default: {
                        cellItem = null
                        break
                      }
                    }
                    return (
                      <TableCell align={align} component="td" key={id} style={cellWidth(width)}>
                        {cellItem}
                      </TableCell>
                    )
                  })}
                  <TableCell component="td">
                    <Row align="end" className={classes.actions}>
                      {granted && (
                        <Button
                          className={classes.send}
                          color="primary"
                          onClick={() => this.showSendFunds(row.asset.address)}
                          size="small"
                          testId="balance-send-btn"
                          variant="contained"
                        >
                          <CallMade
                            alt="Send Transaction"
                            className={classNames(classes.leftIcon, classes.iconSmall)}
                          />
                          Send
                        </Button>
                      )}
                      <Button
                        className={classes.receive}
                        color="primary"
                        onClick={this.onShow('Receive')}
                        size="small"
                        variant="contained"
                      >
                        <CallReceived
                          alt="Receive Transaction"
                          className={classNames(classes.leftIcon, classes.iconSmall)}
                        />
                        Receive
                      </Button>
                    </Row>
                  </TableCell>
                </TableRow>
              ))
            }
          </Table>
        </TableContainer>
        <SendModal
          activeScreenType="sendFunds"
          createTransaction={createTransaction}
          ethBalance={ethBalance}
          isOpen={sendFunds.isOpen}
          onClose={this.hideSendFunds}
          safeAddress={safeAddress}
          safeName={safeName}
          selectedToken={sendFunds.selectedToken}
          tokens={activeTokens}
        />
        <Modal
          description="Receive Tokens Form"
          handleClose={this.onHide('Receive')}
          open={showReceive}
          paperClassName={classes.receiveModal}
          title="Receive Tokens"
        >
          <Receive onClose={this.onHide('Receive')} safeAddress={safeAddress} safeName={safeName} />
        </Modal>
      </>
    )
  }
}

export default withStyles(styles)(Balances)
