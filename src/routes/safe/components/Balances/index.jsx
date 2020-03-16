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
import Tokens from './Tokens'
import { BALANCE_TABLE_ASSET_ID, type BalanceRow, generateColumns, getBalanceData } from './dataFetcher'
import { styles } from './style'

import Modal from '~/components/Modal'
import { SafeVersionContext } from '~/components/SafeVersionProvider'
import Table from '~/components/Table'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Button from '~/components/layout/Button'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Divider from '~/components/layout/Divider'
import Row from '~/components/layout/Row'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import { type Token } from '~/logic/tokens/store/model/token'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import Collectibles from '~/routes/safe/components/Balances/Collectibles'
import SendModal from '~/routes/safe/components/Balances/SendModal'
import { BALANCE_TABLE_BALANCE_ID, BALANCE_TABLE_VALUE_ID } from '~/routes/safe/components/Balances/dataFetcher'
import DropdownCurrency from '~/routes/safe/components/DropdownCurrency'
import { history } from '~/store'

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
      showCoins: true,
      showCollectibles: false,
      showReceive: false,
    }
    props.fetchTokens()
  }

  static isCoinsLocation = /\/balances\/?$/
  static isCollectiblesLocation = /\/balances\/collectibles$/

  componentDidMount(): void {
    const { activateTokensByBalance, fetchCurrencyValues, safeAddress } = this.props
    fetchCurrencyValues(safeAddress)
    activateTokensByBalance(safeAddress)

    const showCollectibles = Balances.isCollectiblesLocation.test(history.location.pathname)
    const showCoins = Balances.isCoinsLocation.test(history.location.pathname)

    if (!showCollectibles && !showCoins) {
      history.replace(`${SAFELIST_ADDRESS}/${this.props.safeAddress}/balances`)
    }

    this.setState({
      showCoins,
      showCollectibles,
    })
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

  viewCoins = (replace = false) => {
    const url = `${SAFELIST_ADDRESS}/${this.props.safeAddress}/balances`

    if (replace) {
      history.replace(url)
    } else {
      history.push(url)
    }
  }

  viewCollectibles = () => {
    const url = `${SAFELIST_ADDRESS}/${this.props.safeAddress}/balances/collectibles`
    history.push(url)
  }

  render() {
    const { sendFunds, showCoins, showCollectibles, showReceive, showToken } = this.state
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
      <SafeVersionContext.Consumer>
        {value => {
          const subMenuOptions = [{ enabled: showCoins, legend: 'Coins', onClick: this.viewCoins }]
          const erc721Enabled = value.featuresEnabled.includes('ERC721')

          if (erc721Enabled) {
            subMenuOptions.push({ enabled: showCollectibles, legend: 'Collectibles', onClick: this.viewCollectibles })
          } else {
            if (this.state.showCollectibles) {
              this.viewCoins(true)
            }
          }

          return (
            <>
              <Row align="center" className={classes.controls}>
                <Col className={classes.assetTabs} sm={6} start="sm" xs={12}>
                  {subMenuOptions.length > 1 &&
                    subMenuOptions.map(({ enabled, legend, onClick }, index) => (
                      <React.Fragment key={`legend-${index}`}>
                        {index > 0 && <Divider className={classes.assetDivider} />}
                        <ButtonLink
                          className={enabled ? classes.assetTabActive : ''}
                          color={enabled ? 'secondary' : 'medium'}
                          onClick={onClick}
                          size="md"
                          testId="coins-assets-btn"
                          weight={enabled ? 'bold' : 'regular'}
                        >
                          {legend}
                        </ButtonLink>
                      </React.Fragment>
                    ))}
                </Col>
                <Col className={classes.tokenControls} end="sm" sm={6} xs={12}>
                  {showCoins && (
                    <>
                      <DropdownCurrency />
                      <ButtonLink
                        className={classes.manageTokensButton}
                        onClick={this.onShow('Token')}
                        size="lg"
                        testId="manage-tokens-btn"
                      >
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
                    </>
                  )}
                </Col>
              </Row>
              {showCoins && (
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
              )}
              {erc721Enabled && showCollectibles && <Collectibles />}
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
        }}
      </SafeVersionContext.Consumer>
    )
  }
}

export default withStyles(styles)(Balances)
