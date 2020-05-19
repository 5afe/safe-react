import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import cn from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import ExpandedTxComponent from './ExpandedTx'
import Status from './Status'
import { TX_TABLE_ID, TX_TABLE_RAW_CANCEL_TX_ID, TX_TABLE_RAW_TX_ID, generateColumns, getTxTableData } from './columns'
import { styles } from './style'

import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import { extendedTransactionsSelector } from 'src/routes/safe/container/selector'
import { safeCancellationTransactionsSelector } from 'src/routes/safe/store/selectors'

export const TRANSACTION_ROW_TEST_ID = 'transaction-row'

const CollapseAux: any = Collapse

const expandCellStyle = {
  paddingLeft: 0,
  paddingRight: 15,
}

const TxsTable = ({ classes }) => {
  const [expandedTx, setExpandedTx] = useState(null)
  const cancellationTransactions = useSelector(safeCancellationTransactionsSelector)
  const transactions = useSelector(extendedTransactionsSelector)

  const handleTxExpand = (safeTxHash) => {
    setExpandedTx((prevTx) => (prevTx === safeTxHash ? null : safeTxHash))
  }

  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const filteredData = getTxTableData(transactions, cancellationTransactions)
    .sort((tx1, tx2) => {
      // First order by nonce
      const aNonce = tx1.tx.nonce
      const bNonce = tx1.tx.nonce
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
            sortedData.map((row, index) => (
              <React.Fragment key={index}>
                <TableRow
                  className={cn(classes.row, expandedTx === row.tx.safeTxHash && classes.expandedRow)}
                  data-testid={TRANSACTION_ROW_TEST_ID}
                  onClick={() => handleTxExpand(row.tx.safeTxHash)}
                  tabIndex={-1}
                >
                  {autoColumns.map((column: any) => (
                    <TableCell
                      align={column.align}
                      className={cn(classes.cell, ['cancelled', 'failed'].includes(row.status) && classes.cancelledRow)}
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
                  <TableCell style={expandCellStyle}>
                    {!row.tx.creationTx && (
                      <IconButton disableRipple>
                        {expandedTx === row.safeTxHash ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                {!row.tx.creationTx && (
                  <TableRow>
                    <TableCell
                      className={classes.extendedTxContainer}
                      colSpan={6}
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                      <CollapseAux
                        cancelTx={row[TX_TABLE_RAW_CANCEL_TX_ID]}
                        component={ExpandedTxComponent}
                        in={expandedTx === row.tx.safeTxHash}
                        timeout="auto"
                        tx={row[TX_TABLE_RAW_TX_ID]}
                        unmountOnExit
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          }
        </Table>
      </TableContainer>
    </Block>
  )
}

export default withStyles(styles as any)(TxsTable)
