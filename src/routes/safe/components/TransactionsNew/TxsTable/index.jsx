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
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import ExpandedTxComponent from './ExpandedTx'
import {
  getTxTableData, generateColumns, TX_TABLE_DATE_ID, type TransactionRow, TX_TABLE_RAW_TX_ID,
} from './columns'
import { styles } from './style'
import Status from './Status'

const expandCellStyle = {
  paddingLeft: 0,
  paddingRight: 0,
}

type Props = {
  classes: Object,
  transactions: List<Transaction>,
  threshold: number,
  owners: List<Owner>,
  userAddress: string,
  granted: boolean,
  safeAddress: string,
  createTransaction: Function,
  processTransaction: Function,
}

const TxsTable = ({
  classes,
  transactions,
  threshold,
  owners,
  granted,
  userAddress,
  safeAddress,
  createTransaction,
  processTransaction,
}: Props) => {
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  const handleTxExpand = (creationTxHash) => {
    setExpandedTx(prevTx => (prevTx === creationTxHash ? null : creationTxHash))
  }

  const columns = generateColumns()
  const autoColumns = columns.filter(c => !c.custom)
  const filteredData = getTxTableData(transactions)

  return (
    <Block className={classes.container}>
      <Table
        label="Transactions"
        defaultOrderBy={TX_TABLE_DATE_ID}
        defaultOrder="desc"
        columns={columns}
        data={filteredData}
        size={filteredData.size}
        defaultFixed
      >
        {(sortedData: Array<TransactionRow>) => sortedData.map((row: any, index: number) => (
          <React.Fragment key={index}>
            <TableRow
              tabIndex={-1}
              className={cn(classes.row, expandedTx === row.tx.creationTxHash && classes.expandedRow)}
              onClick={() => handleTxExpand(row.tx.creationTxHash)}
            >
              {autoColumns.map((column: Column) => (
                <TableCell
                  key={column.id}
                  className={classes.cell}
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
                <IconButton disableRipple>{expandedTx === row.nonce ? <ExpandLess /> : <ExpandMore />}</IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={6}
                className={classes.extendedTxContainer}
              >
                <Collapse
                  in={expandedTx === row.tx.creationTxHash}
                  timeout="auto"
                  component={ExpandedTxComponent}
                  unmountOnExit
                  tx={row[TX_TABLE_RAW_TX_ID]}
                  threshold={threshold}
                  owners={owners}
                  granted={granted}
                  userAddress={userAddress}
                  createTransaction={createTransaction}
                  processTransaction={processTransaction}
                  safeAddress={safeAddress}
                />
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))
        }
      </Table>
    </Block>
  )
}

export default withStyles(styles)(TxsTable)
