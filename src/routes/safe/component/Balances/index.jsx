// @flow
import * as React from 'react'
import { List } from 'immutable'
import classNames from 'classnames/bind'
import { type Token } from '~/routes/tokens/store/model/token'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Modal from '~/components/Modal'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import { getBalanceData, generateColumns, BALANCE_TABLE_ASSET_ID, type BalanceRow, filterByZero } from './dataFetcher'
import Tokens from './Tokens'
import Send from './Send'
import Receive from './Receive'
import { styles } from './style'

type State = {
  hideZero: boolean,
  showToken: boolean,
  showReceive: boolean,
  showSend: boolean,
}

type Props = {
  classes: Object,
  granted: boolean,
  tokens: List<Token>,
  safeAddress: string,
}

type Action = 'Token' | 'Send' | 'Receive'

class Balances extends React.Component<Props, State> {
  state = {
    hideZero: false,
    showToken: true,
    showSend: false,
    showReceive: false,
  }

  onShow = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { checked } = e.target

    this.setState(() => ({ hideZero: checked }))
  }

  render() {
    const {
      hideZero, showToken, showReceive, showSend,
    } = this.state
    const {
      classes, granted, tokens, safeAddress,
    } = this.props

    const columns = generateColumns()
    const autoColumns = columns.filter(c => !c.custom)
    const checkboxClasses = {
      root: classes.root,
    }

    const filteredData = filterByZero(getBalanceData(), hideZero)

    return (
      <React.Fragment>
        <Row align="center" className={classes.message}>
          <Col xs={6}>
            <Checkbox
              classes={checkboxClasses}
              checked={hideZero}
              onChange={this.handleChange}
              color="secondary"
              disableRipple
            />
            <Paragraph className={classes.zero}>Hide zero balances</Paragraph>
          </Col>
          <Col xs={6} end="sm">
            <Paragraph noMargin size="md" color="secondary" className={classes.links} onClick={this.onShow('Token')}>
              Manage Tokens
            </Paragraph>
            <Modal
              title="Manage Tokens"
              description="Enable and disable tokens to be listed"
              handleClose={this.onHide('Token')}
              open={showToken}
            >
              <Tokens tokens={tokens} onClose={this.onHide('Token')} safeAddress={safeAddress} />
            </Modal>
          </Col>
        </Row>
        <Table
          label="Balances"
          defaultOrderBy={BALANCE_TABLE_ASSET_ID}
          columns={columns}
          data={filteredData}
          size={filteredData.length}
          defaultFixed
        >
          {(sortedData: Array<BalanceRow>) => sortedData.map((row: any, index: number) => (
            <TableRow tabIndex={-1} key={index} className={classes.hide}>
              { autoColumns.map((column: Column) => (
                <TableCell key={column.id} style={cellWidth(column.width)} numeric={column.numeric} component="td">
                  {row[column.id]}
                </TableCell>
              )) }
              <TableCell component="td">
                <Row align="end" className={classes.actions}>
                  { granted &&
                    <Button variant="contained" size="small" color="secondary" className={classes.send} onClick={this.onShow('Send')}>
                      <CallMade className={classNames(classes.leftIcon, classes.iconSmall)} />
                      Send
                    </Button>
                  }
                  <Button variant="contained" size="small" color="secondary" className={classes.receive} onClick={this.onShow('Receive')}>
                    <CallReceived className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Receive
                  </Button>
                </Row>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <Modal title="Send Tokens" description="Send Tokens Form" handleClose={this.onHide('Send')} open={showSend}>
          <Send onClose={this.onHide('Send')} />
        </Modal>
        <Modal title="Receive Tokens" description="Receive Tokens Form" handleClose={this.onHide('Receive')} open={showReceive}>
          <Receive onClose={this.onHide('Receive')} />
        </Modal>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Balances)
