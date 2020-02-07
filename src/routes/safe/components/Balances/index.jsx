// @flow
import * as React from 'react'
import { List } from 'immutable'
import classNames from 'classnames/bind'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import { withStyles } from '@material-ui/core/styles'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import { type Token } from '~/logic/tokens/store/model/token'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import ButtonLink from '~/components/layout/ButtonLink'
import Modal from '~/components/Modal'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import {
  getBalanceData, generateColumns, BALANCE_TABLE_ASSET_ID, type BalanceRow,
} from './dataFetcher'
import AssetTableCell from './AssetTableCell'
import Tokens from './Tokens'
import SendModal from './SendModal'
import Receive from './Receive'
import { styles } from './style'
import DropdownCurrency from '~/routes/safe/components/DropdownCurrency'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import { BALANCE_TABLE_BALANCE_ID, BALANCE_TABLE_VALUE_ID } from '~/routes/safe/components/Balances/dataFetcher'
import Divider from '~/components/layout/Divider'

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
    const { safeAddress, fetchCurrencyValues, activateTokensByBalance } = this.props
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
    const {
      showToken, showReceive, sendFunds,
    } = this.state
    const {
      classes,
      granted,
      tokens,
      safeAddress,
      activeTokens,
      blacklistedTokens,
      safeName,
      ethBalance,
      createTransaction,
      currencySelected,
      currencyValues,
    } = this.props

    const columns = generateColumns()
    const autoColumns = columns.filter((c) => !c.custom)

    const filteredData = getBalanceData(activeTokens, currencySelected, currencyValues)
    const coinsSelected = true
    const collectiblesSelected = false

    return (
      <>
        <Row align="center" className={classes.message}>
          <Col xs={4} start="sm" className={classes.assetSection}>
            <ButtonLink
              className={coinsSelected ? classes.assetSectionButtonActive : ''}
              color={!coinsSelected ? 'medium' : 'secondary'}
              onClick={this.onShow('Token')}
              size="md"
              testId="coins-assets-btn"
              weight={coinsSelected ? 'bold' : 'regular'}
            >
              Coins
            </ButtonLink>
            <Divider className={classes.assetSectionDivider} />
            <ButtonLink
              color={!collectiblesSelected ? 'medium' : 'secondary'}
              onClick={this.onShow('Token')}
              size="md"
              testId="collectible-assets-btn"
              weight={collectiblesSelected ? 'bold' : 'regular'}
            >
              Collectibles
            </ButtonLink>
          </Col>
          <Col xs={8} end="sm">
            <DropdownCurrency />
            <ButtonLink size="lg" onClick={this.onShow('Token')} testId="manage-tokens-btn">
              Manage List
            </ButtonLink>
            <Modal
              title="Manage List"
              description="Enable and disable tokens to be listed"
              handleClose={this.onHide('Token')}
              open={showToken}
            >
              <Tokens
                tokens={tokens}
                onClose={this.onHide('Token')}
                safeAddress={safeAddress}
                activeTokens={activeTokens}
                blacklistedTokens={blacklistedTokens}
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
            {(sortedData: Array<BalanceRow>) => sortedData.map((row: any, index: number) => (
              <TableRow tabIndex={-1} key={index} className={classes.hide} data-testid={BALANCE_ROW_TEST_ID}>
                {autoColumns.map((column: Column) => {
                  const { id, width, align } = column
                  let cellItem
                  switch (id) {
                    case BALANCE_TABLE_ASSET_ID: {
                      cellItem = <AssetTableCell asset={row[id]} />
                      break
                    }
                    case BALANCE_TABLE_BALANCE_ID: {
                      cellItem = (
                        <div>
                          {row[id]}
                        </div>
                      )
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
                    <TableCell
                      key={id}
                      style={cellWidth(width)}
                      align={align}
                      component="td"
                    >
                      {cellItem}
                    </TableCell>
                  )
                })}
                <TableCell component="td">
                  <Row align="end" className={classes.actions}>
                    {granted && (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        className={classes.send}
                        onClick={() => this.showSendFunds(row.asset.address)}
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
