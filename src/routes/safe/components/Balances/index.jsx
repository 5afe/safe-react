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
  getBalanceData,
  generateColumns,
  BALANCE_TABLE_ASSET_ID,
  type BalanceRow,
} from './dataFetcher'
import AssetTableCell from './AssetTableCell'
import Tokens from './Tokens'
import SendModal from './SendModal'
import Receive from './Receive'
import Collectibles from './Collectibles'
import { styles } from './style'
import DropdownCurrency from '~/routes/safe/components/DropdownCurrency'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import {
  BALANCE_TABLE_BALANCE_ID,
  BALANCE_TABLE_VALUE_ID,
} from '~/routes/safe/components/Balances/dataFetcher'
import Divider from '~/components/layout/Divider'

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

type State = {
  sendFunds: Object,
  showCoins: boolean,
  showCollectibles: boolean,
  showReceive: boolean,
  showToken: boolean,
}

type Props = {
  activateTokensByBalance: Function,
  activeTokens: List<Token>,
  blacklistedTokens: List<Token>,
  classes: Object,
  createTransaction: Function,
  currencySelected: string,
  currencyValues: BalanceCurrencyType[],
  ethBalance: string,
  fetchCurrencyValues: Function,
  fetchTokens: Function,
  granted: boolean,
  safeAddress: string,
  safeName: string,
  tokens: List<Token>,
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
      showCoins: false,
      showCollectibles: true,
      showReceive: false,
    }
    props.fetchTokens()
  }

  componentDidMount(): void {
    const {
      safeAddress,
      fetchCurrencyValues,
      activateTokensByBalance,
    } = this.props
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

  showCoinsList = () => {
    this.setState({ showCoins: true })
  }

  hideCoinsList = () => {
    this.setState({ showCoins: false })
  }

  showCollectiblesList = () => {
    this.setState({ showCollectibles: true })
  }

  hideCollectiblesList = () => {
    this.setState({ showCollectibles: false })
  }

  viewCoins = () => {
    const { showCoins } = this.state

    if (showCoins) {
      return
    }

    this.hideCollectiblesList()
    this.showCoinsList()
  }

  viewCollectibles = () => {
    const { showCollectibles } = this.state

    if (showCollectibles) {
      return
    }

    this.hideCoinsList()
    this.showCollectiblesList()
  }

  render() {
    const {
      showToken, showReceive, sendFunds, showCoins, showCollectibles,
    } = this.state
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

    const filteredData = getBalanceData(
      activeTokens,
      currencySelected,
      currencyValues
    )

    return (
      <>
        <Row align="center" className={classes.controls}>
          <Col sm={6} xs={12} start="sm" className={classes.assetTabs}>
            <ButtonLink
              className={showCoins ? classes.assetSectionButtonActive : ''}
              color={!showCoins ? 'medium' : 'secondary'}
              onClick={this.viewCoins}
              size="md"
              testId="coins-assets-btn"
              weight={showCoins ? 'bold' : 'regular'}
            >
              Coins
            </ButtonLink>
            <Divider className={classes.assetDivider} />
            <ButtonLink
              className={showCollectibles ? classes.assetTabActive : ''}
              color={!showCollectibles ? 'medium' : 'secondary'}
              onClick={this.viewCollectibles}
              size="md"
              testId="collectible-assets-btn"
              weight={showCollectibles ? 'bold' : 'regular'}
            >
              Collectibles
            </ButtonLink>
          </Col>
          <Col sm={6} xs={12} className={classes.tokenControls} end="sm">
            { showCoins && <DropdownCurrency /> }
            <ButtonLink className={classes.manageTokensButton} size="lg" onClick={this.onShow('Token')} testId="manage-tokens-btn">
              Manage Tokens
            </ButtonLink>
            <Modal
              description="Enable and disable tokens to be listed"
              handleClose={this.onHide('Token')}
              open={showToken}
              title="Manage Tokens"
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
        { showCoins
        && (
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
        )}
        { showCollectibles && (<Collectibles />)}
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
