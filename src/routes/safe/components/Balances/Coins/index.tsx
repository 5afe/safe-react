import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import React from 'react'
import { useSelector } from 'react-redux'

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

  React.useMemo(() => {
    setFilteredData(getBalanceData(activeTokens, selectedCurrency, currencyValues, currencyRate))
  }, [activeTokens, selectedCurrency, currencyValues, currencyRate])

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

                    cellItem =
                      showCurrencyValueRow && selectedCurrency ? (
                        <div className={classes.currencyValueRow}>{row[id] ? row[id] : `0.00 ${selectedCurrency}`}</div>
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
