// @flow
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import cn from 'classnames'
import { List } from 'immutable'
import React, { useState } from 'react'

import ExpandedTxComponent from './ExpandedTx'
import Status from './Status'
import {
  TX_TABLE_ID,
  TX_TABLE_RAW_CANCEL_TX_ID,
  TX_TABLE_RAW_TX_ID,
  type TransactionRow,
  generateColumns,
  getTxTableData,
} from './columns'
import { styles } from './style'

import Table from '~/components/Table'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import { type Transaction } from '~/routes/safe/store/models/transaction'

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
  cancellationTransactions,
  classes,
  createTransaction,
  granted,
  nonce,
  owners,
  processTransaction,
  safeAddress,
  threshold,
  transactions,
  userAddress,
}: Props) => {
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  const handleTxExpand = safeTxHash => {
    setExpandedTx(prevTx => (prevTx === safeTxHash ? null : safeTxHash))
  }

  const columns = generateColumns()
  const autoColumns = columns.filter(c => !c.custom)
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
          columns={columns}
          data={filteredData}
          defaultFixed
          defaultOrder="desc"
          defaultOrderBy={TX_TABLE_ID}
          defaultRowsPerPage={25}
          label="Transactions"
          size={filteredData.size}
        >
          {(sortedData: Array<TransactionRow>) =>
            sortedData.map((row: any, index: number) => (
              <React.Fragment key={index}>
                <TableRow
                  className={cn(classes.row, expandedTx === row.tx.safeTxHash && classes.expandedRow)}
                  data-testid={TRANSACTION_ROW_TEST_ID}
                  onClick={() => handleTxExpand(row.tx.safeTxHash)}
                  tabIndex={-1}
                >
                  {autoColumns.map((column: Column) => (
                    <TableCell
                      align={column.align}
                      className={cn(classes.cell, row.status === 'cancelled' && classes.cancelledRow)}
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
                      <Collapse
                        cancelTx={row[TX_TABLE_RAW_CANCEL_TX_ID]}
                        component={ExpandedTxComponent}
                        createTransaction={createTransaction}
                        granted={granted}
                        in={expandedTx === row.tx.safeTxHash}
                        nonce={nonce}
                        owners={owners}
                        processTransaction={processTransaction}
                        safeAddress={safeAddress}
                        threshold={threshold}
                        timeout="auto"
                        tx={row[TX_TABLE_RAW_TX_ID]}
                        unmountOnExit
                        userAddress={userAddress}
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

export default withStyles(styles)(TxsTable)
