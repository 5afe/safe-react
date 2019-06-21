// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import Collapse from '@material-ui/core/Collapse'
import classNames from 'classnames/bind'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import Button from '@material-ui/core/Button'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import Col from '~/components/layout/Col'
import { type Token } from '~/logic/tokens/store/model/token'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Modal from '~/components/Modal'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import ExpandedTxComponent from './ExpandedTx'
import {
  getTxTableData, generateColumns, TX_TABLE_NONCE_ID, type TransactionRow, TX_TABLE_RAW_TX_ID,
} from './columns'
import { styles } from './style'
import Status from './Status'

type Props = {
  classes: Object,
  transactions: List<Transaction>,
}

const TxsTable = (props: Props) => {
  const { classes, transactions } = props
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  const handleTxExpand = (nonce) => {
    setExpandedTx(prevTx => (prevTx === nonce ? null : nonce))
  }

  const columns = generateColumns()
  const autoColumns = columns.filter(c => !c.custom)
  const filteredData = getTxTableData(transactions)

  return (
    <Block className={classes.container}>
      <Table
        label="Transactions"
        defaultOrderBy={TX_TABLE_NONCE_ID}
        defaultOrder="desc"
        columns={columns}
        data={filteredData}
        size={filteredData.size}
        defaultFixed
      >
        {(sortedData: Array<TransactionRow>) => sortedData.map((row: any, index: number) => (
          <>
            <TableRow tabIndex={-1} key={index} className={classes.row} onClick={() => handleTxExpand(row.nonce)}>
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
            </TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse
                in={expandedTx === row.nonce}
                timeout="auto"
                component={ExpandedTxComponent}
                unmountOnExit
                tx={row[TX_TABLE_RAW_TX_ID]}
              />
            </TableCell>
          </>
        ))
        }
      </Table>
    </Block>
  )
}

export default withStyles(styles)(TxsTable)
