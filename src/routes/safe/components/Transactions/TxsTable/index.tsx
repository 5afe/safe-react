import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import cn from 'classnames'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { ExpandedTx } from './ExpandedTx'
import Status from './Status'
import { TX_TABLE_ID, generateColumns, getTxTableData } from './columns'
import { styles } from './style'

import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import { safeCancellationTransactionsSelector } from 'src/logic/safe/store/selectors'
import { extendedTransactionsSelector } from 'src/logic/safe/store/selectors/transactions'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

export const TRANSACTION_ROW_TEST_ID = 'transaction-row'

const useStyles = makeStyles(styles)

const TxsTable = (): React.ReactElement => {
  const classes = useStyles()
  const [expandedTx, setExpandedTx] = useState(null)
  const cancellationTransactions = useSelector(safeCancellationTransactionsSelector)
  const transactions = useSelector(extendedTransactionsSelector)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Transactions' })
  }, [trackEvent])

  const handleTxExpand = (rowId) => {
    setExpandedTx((prevRowId) => (prevRowId === rowId ? null : rowId))
  }

  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const filteredData = getTxTableData(transactions, cancellationTransactions)
    .sort((tx1, tx2) => {
      // First order by nonce
      const aNonce = Number(tx1.tx?.nonce)
      const bNonce = Number(tx1.tx?.nonce)
      if (aNonce && bNonce) {
        const difference = aNonce - bNonce
        if (difference !== 0) {
          return difference
        }
      }
      // If can't be ordered by nonce, order by date
      const aDateOrder = tx1.dateOrder
      const bDateOrder = tx2.dateOrder
      // Second by date
      if (!aDateOrder || !bDateOrder) {
        return 0
      }
      return aDateOrder - bDateOrder
    })
    .map((tx, id) => {
      return {
        ...tx,
        id,
      }
    })

  return (
    <Block className={classes.container}>
      <TableContainer>
        <Table
          columns={columns}
          data={filteredData}
          defaultFixed
          defaultOrder="desc"
          defaultOrderBy={TX_TABLE_ID}
          defaultRowsPerPage={25}
          label="Transactions"
          size={filteredData.size}
        >
          {(sortedData) =>
            sortedData.map((row) => {
              const rowId = `${row.tx.safeTxHash}-${row.tx.type}`
              return (
                <React.Fragment key={rowId}>
                  <TableRow
                    className={cn(classes.row, expandedTx === rowId && classes.expandedRow)}
                    data-testid={TRANSACTION_ROW_TEST_ID}
                    onClick={() => handleTxExpand(rowId)}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column) => (
                      <TableCell
                        align={column.align}
                        className={cn(['cancelled', 'failed'].includes(row.status) && classes.cancelledRow)}
                        component="td"
                        key={column.id}
                        style={cellWidth(column.width)}
                      >
                        {row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell component="td">
                      <Row align="end" className={classes.actions}>
                        <Status status={row.status} />
                      </Row>
                    </TableCell>
                    <TableCell className={classes.expandCellStyle}>
                      <IconButton disableRipple>{expandedTx === rowId ? <ExpandLess /> : <ExpandMore />}</IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className={classes.extendedTxContainer}
                      colSpan={6}
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                      <Collapse in={expandedTx === rowId} unmountOnExit>
                        <ExpandedTx row={row} />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })
          }
        </Table>
      </TableContainer>
    </Block>
  )
}

export default TxsTable
