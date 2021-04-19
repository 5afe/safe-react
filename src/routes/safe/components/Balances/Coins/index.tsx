import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { List } from 'immutable'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { Skeleton } from '@material-ui/lab'

import InfoIcon from 'src/assets/icons/info_red.svg'
import { FixedIcon, Text, Button } from '@gnosis.pm/safe-react-components'

import Img from 'src/components/layout/Img'
import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Row from 'src/components/layout/Row'
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
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './styles'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'

const StyledButton = styled(Button)`
  &&.MuiButton-root {
    margin: 4px 12px 4px 0px;
    padding: 0 12px;
    min-width: auto;
  }
  svg {
    margin: 0 6px 0 0;
  }
`

const useStyles = makeStyles(styles)

type Props = {
  showReceiveFunds: () => void
  showSendFunds: (tokenAddress: string) => void
}

type CurrencyTooltipProps = {
  valueWithCurrency: string
  balanceWithSymbol: string
}

const CurrencyTooltip = (props: CurrencyTooltipProps): React.ReactElement | null => {
  const { balanceWithSymbol, valueWithCurrency } = props
  const classes = useStyles()
  const balance = balanceWithSymbol.replace(/[^\d.-]/g, '')
  const value = valueWithCurrency.replace(/[^\d.-]/g, '')
  if (!Number(value) && Number(balance)) {
    return (
      <Tooltip placement="top" title="Value may be zero due to missing token price information">
        <span>
          <Img className={classes.tooltipInfo} alt="Info Tooltip" height={16} src={InfoIcon} />
        </span>
      </Tooltip>
    )
  }
  return null
}

const Coins = (props: Props): React.ReactElement => {
  const { showReceiveFunds, showSendFunds } = props
  const classes = useStyles()
  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const selectedCurrency = useSelector(currentCurrencySelector)
  const safeTokens = useSelector(extendedSafeTokensSelector)
  const granted = useSelector(grantedSelector)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Coins' })
  }, [trackEvent])

  const filteredData: List<BalanceData> = useMemo(() => getBalanceData(safeTokens, selectedCurrency), [
    safeTokens,
    selectedCurrency,
  ])

  return (
    <TableContainer>
      <Table columns={columns} data={filteredData} defaultRowsPerPage={100} label="Balances" size={filteredData.size}>
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
                          <CurrencyTooltip
                            valueWithCurrency={valueWithCurrency}
                            balanceWithSymbol={row[BALANCE_TABLE_BALANCE_ID]}
                          />
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
                    <StyledButton
                      color="primary"
                      onClick={() => showSendFunds(row.asset.address)}
                      size="md"
                      variant="contained"
                      data-testid="balance-send-btn"
                    >
                      <FixedIcon type="arrowSentWhite" />
                      <Text size="xl" color="white">
                        Send
                      </Text>
                    </StyledButton>
                  )}
                  <StyledButton color="primary" onClick={showReceiveFunds} size="md" variant="contained">
                    <FixedIcon type="arrowReceivedWhite" />
                    <Text size="xl" color="white">
                      Receive
                    </Text>
                  </StyledButton>
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
