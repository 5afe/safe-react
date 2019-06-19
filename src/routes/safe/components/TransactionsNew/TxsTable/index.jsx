// @flow
import * as React from 'react'
import { List } from 'immutable'
import classNames from 'classnames/bind'
import { type Token } from '~/logic/tokens/store/model/token'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import Button from '@material-ui/core/Button'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import Col from '~/components/layout/Col'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Modal from '~/components/Modal'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import {
  getTxTableData, generateColumns, TX_TABLE_NONCE_ID, type BalanceRow,
} from './columns'
import { styles } from './style'

type State = {

}

type Props = {
  classes: Object,
  transactions: List<Transaction>,
}

type Action = 'Token' | 'Send' | 'Receive'

class Balances extends React.Component<Props, State> {
  state = {}

  render() {
    const {
      classes,
      transactions,
    } = this.props

    const columns = generateColumns()
    const autoColumns = columns.filter(c => !c.custom)
    const filteredData = getTxTableData(transactions)

    return (
      <Block className={classes.container}>
        <Table
          label="Transactions"
          defaultOrderBy={TX_TABLE_NONCE_ID}
          columns={columns}
          data={filteredData}
          size={filteredData.size}
          defaultFixed
        >
          {(sortedData: Array<BalanceRow>) => sortedData.map((row: any, index: number) => (
            <TableRow tabIndex={-1} key={index} className={classes.row}>
              {autoColumns.map((column: Column) => (
                <TableCell key={column.id} className={classes.cell} style={cellWidth(column.width)} align={column.align} component="td">
                  {row[column.id]}
                </TableCell>
              ))}
              {/* <TableCell component="td">
                <Row align="end" className={classes.actions}>
                  {granted && (
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      className={classes.send}
                      onClick={() => this.showSendFunds(row.asset.name)}
                      data-testid="balance-send-btn"
                    >
                      <CallMade className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Send
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    className={classes.receive}
                    onClick={this.onShow('Receive')}
                  >
                    <CallReceived className={classNames(classes.leftIcon, classes.iconSmall)} />
                      Receive
                  </Button>
                </Row>
              </TableCell> */}
            </TableRow>
          ))
          }
        </Table>
      </Block>
    )
  }
}

export default withStyles(styles)(Balances)
