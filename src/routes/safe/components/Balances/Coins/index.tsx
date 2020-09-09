import React, { useEffect } from 'react'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import Img from 'src/components/layout/Img'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import { useSelector } from 'react-redux'

import InfoIcon from 'src/assets/icons/info.svg'

import { styles } from './styles'

import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Button from 'src/components/layout/Button'
import Row from 'src/components/layout/Row'
import {
  currencyRateSelector,
  currentCurrencySelector,
  safeFiatBalancesListSelector,
} from 'src/logic/currencyValues/store/selectors'
import { BALANCE_ROW_TEST_ID } from 'src/routes/safe/components/Balances'
import AssetTableCell from 'src/routes/safe/components/Balances/AssetTableCell'
import {
  BALANCE_TABLE_ASSET_ID,
  BALANCE_TABLE_BALANCE_ID,
  BALANCE_TABLE_VALUE_ID,
  generateColumns,
  getBalanceData,
  BalanceData,
} from 'src/routes/safe/components/Balances/dataFetcher'
import { extendedSafeTokensSelector, grantedSelector } from 'src/routes/safe/container/selector'
import { Skeleton } from '@material-ui/lab'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

const useStyles = makeStyles(styles as any)

type Props = {
  showReceiveFunds: () => void
  showSendFunds: (tokenAddress: string) => void
}

export type BalanceDataRow = List<{
  asset: {
    name: string
    address: string
    logoUri: string
  }
  assetOrder: string
  balance: string
  balanceOrder: number
  fixed: boolean
  value: string
}>

const Coins = (props: Props): React.ReactElement => {
  const { showReceiveFunds, showSendFunds } = props
  const classes = useStyles()
  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const selectedCurrency = useSelector(currentCurrencySelector)
  const currencyRate = useSelector(currencyRateSelector)
  const activeTokens = useSelector(extendedSafeTokensSelector)
  const currencyValues = useSelector(safeFiatBalancesListSelector)
  const granted = useSelector(grantedSelector)
  const [filteredData, setFilteredData] = React.useState<List<BalanceData>>(List())
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Coins' })
  }, [trackEvent])

  React.useMemo(() => {
    setFilteredData(getBalanceData(activeTokens, selectedCurrency, currencyValues, currencyRate))
  }, [activeTokens, selectedCurrency, currencyValues, currencyRate])

  const showCurrencyTooltip = (valueWithCurrency: string, balanceWithSymbol: string): React.ReactElement | null => {
    const balance = balanceWithSymbol.replace(/[^\d.-]/g, '')
    const value = valueWithCurrency.replace(/[^\d.-]/g, '')
    if (!Number(value) && Number(balance)) {
      return (
        <Tooltip placement="top" title="Balance may be zero due to missing token price information">
          <span onClick={(event) => event.stopPropagation()}>
            <Img className={classes.tooltipInfo} alt="Info Tooltip" height={16} src={InfoIcon} />
          </span>
        </Tooltip>
      )
    }
    return null
  }

  return (
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
        {(sortedData) =>
          sortedData.map((row, index) => (
            <TableRow className={classes.hide} data-testid={BALANCE_ROW_TEST_ID} key={index} tabIndex={-1}>
              {autoColumns.map((column) => {
                const { align, id, width } = column
                let cellItem
                switch (id) {
                  case BALANCE_TABLE_ASSET_ID: {
                    cellItem = <AssetTableCell asset={row[id]} />
                    break
                  }
                  case BALANCE_TABLE_BALANCE_ID: {
                    cellItem = <div data-testid={`balance-${row[BALANCE_TABLE_ASSET_ID].symbol}`}>{row[id]}</div>
                    break
                  }
                  case BALANCE_TABLE_VALUE_ID: {
                    // If there are no values for that row but we have balances, we display as '0.00 {CurrencySelected}'
                    // In case we don't have balances, we display a skeleton
                    const showCurrencyValueRow = row[id] || row[BALANCE_TABLE_BALANCE_ID]
                    const valueWithCurrency = row[id] ? row[id] : `0.00 ${selectedCurrency}`
                    cellItem =
                      showCurrencyValueRow && selectedCurrency ? (
                        <div className={classes.currencyValueRow}>
                          {valueWithCurrency}
                          {showCurrencyTooltip(valueWithCurrency, row[BALANCE_TABLE_BALANCE_ID])}
                        </div>
                      ) : (
                        <Skeleton animation="wave" />
                      )
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
                      onClick={() => showSendFunds(row.asset.address)}
                      size="small"
                      testId="balance-send-btn"
                      variant="contained"
                    >
                      {/* <CallMade alt="Send Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} /> */}
                      Send
                    </Button>
                  )}
                  <Button
                    className={classes.receive}
                    color="primary"
                    onClick={showReceiveFunds}
                    size="small"
                    variant="contained"
                  >
                    {/* <CallReceived
                      alt="Receive Transaction"
                      className={classNames(classes.leftIcon, classes.iconSmall)}
                    /> */}
                    Receive
                  </Button>
                </Row>
              </TableCell>
            </TableRow>
          ))
        }
      </Table>
    </TableContainer>
  )
}

export default Coins
