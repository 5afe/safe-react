// @flow
import React, { useState } from 'react'
import cn from 'classnames'
import { List } from 'immutable'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import ExpandedTxComponent from './ExpandedTx'
import {
  getTxTableData,
  generateColumns,
  TX_TABLE_ID,
  TX_TABLE_RAW_TX_ID,
  TX_TABLE_RAW_CANCEL_TX_ID,
  type TransactionRow,
} from './columns'
import { styles } from './style'
import Status from './Status'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'

export const TRANSACTION_ROW_TEST_ID = 'transaction-row'

const expandCellStyle = {
  paddingLeft: 0,
  paddingRight: 15,
}

type Props = {
  classes: Object,
  transactions: List<Transaction | IncomingTransaction>,
  cancellationTransactions: List<Transaction>,
  threshold: number,
  owners: List<Owner>,
  userAddress: string,
  granted: boolean,
  safeAddress: string,
  nonce: number,
  createTransaction: Function,
  processTransaction: Function,
}

const TxsTable = ({
  classes,
  transactions,
  cancellationTransactions,
  threshold,
  owners,
  granted,
  userAddress,
  safeAddress,
  createTransaction,
  processTransaction,
  nonce,
}: Props) => {
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  const handleTxExpand = (safeTxHash) => {
    setExpandedTx((prevTx) => (prevTx === safeTxHash ? null : safeTxHash))
  }

  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const filteredData = getTxTableData(transactions, cancellationTransactions)
    .sort(({ dateOrder: a }, { dateOrder: b }) => {
      if (!a || !b) {
        return 0
      }
      return a - b
    })
    .map((tx, id) => ({ ...tx, id }))

  return (
    <Block className={classes.container}>
      <TableContainer>
        <Table
          label="Transactions"
          defaultOrderBy={TX_TABLE_ID}
          defaultOrder="desc"
          defaultRowsPerPage={25}
          columns={columns}
          data={filteredData}
          size={filteredData.size}
          defaultFixed
        >
          {(sortedData: Array<TransactionRow>) => sortedData.map((row: any, index: number) => (
            <React.Fragment key={index}>
              <TableRow
                tabIndex={-1}
                className={cn(classes.row, expandedTx === row.tx.safeTxHash && classes.expandedRow)}
                onClick={() => handleTxExpand(row.tx.safeTxHash)}
                data-testid={TRANSACTION_ROW_TEST_ID}
              >
                {autoColumns.map((column: Column) => (
                  <TableCell
                    key={column.id}
                    className={cn(classes.cell, row.status === 'cancelled' && classes.cancelledRow)}
                    style={cellWidth(column.width)}
                    align={column.align}
                    component="td"
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
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                    className={classes.extendedTxContainer}
                  >
                    <Collapse
                      in={expandedTx === row.tx.safeTxHash}
                      timeout="auto"
                      component={ExpandedTxComponent}
                      unmountOnExit
                      tx={row[TX_TABLE_RAW_TX_ID]}
                      cancelTx={row[TX_TABLE_RAW_CANCEL_TX_ID]}
                      threshold={threshold}
                      owners={owners}
                      granted={granted}
                      userAddress={userAddress}
                      createTransaction={createTransaction}
                      processTransaction={processTransaction}
                      safeAddress={safeAddress}
                      nonce={nonce}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </Table>
      </TableContainer>
    </Block>
  )
}

export default withStyles(styles)(TxsTable)
