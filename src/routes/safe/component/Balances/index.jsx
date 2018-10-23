// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
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
import { type Column } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import { sm, xs } from '~/theme/variables'
import { getBalanceData, generateColumns, BALANCE_TABLE_ASSET_ID, type BalanceRow, filterByZero } from './dataFetcher'
import Tokens from './Tokens'

type State = {
  hideZero: boolean,
  showToken: boolean,
}

const styles = theme => ({
  root: {
    width: '20px',
    marginRight: sm,
  },
  zero: {
    letterSpacing: '-0.5px',
  },
  message: {
    margin: `${sm} 0`,
  },
  actionIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 16,
  },
  hide: {
    '&:hover': {
      backgroundColor: '#fff3e2',
    },
    '&:hover $actions': {
      visibility: 'initial',
    },
  },
  actions: {
    justifyContent: 'flex-end',
    visibility: 'hidden',
  },
  send: {
    minWidth: '0px',
    marginRight: sm,
    width: '70px',
  },
  receive: {
    minWidth: '0px',
    width: '95px',
  },
  leftIcon: {
    marginRight: xs,
  },
  links: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

type Props = {
  classes: Object,
}

class Balances extends React.Component<Props, State> {
  state = {
    hideZero: false,
    showToken: false,
  }

  onShowToken = () => {
    this.setState(() => ({ showToken: true }))
  }

  onHideToken = () => {
    this.setState(() => ({ showToken: false }))
  }

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { checked } = e.target

    this.setState(() => ({ hideZero: checked }))
  }

  render() {
    const { hideZero, showToken } = this.state
    const { classes } = this.props

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
            <Paragraph noMargin size="md" color="secondary" className={classes.links} onClick={this.onShowToken}>
              Manage Tokens
            </Paragraph>
            <Modal
              title="Manage Tokens"
              description="Enable and disable tokens to be listed"
              handleClose={this.onHideToken}
              open={showToken}
            >
              <Tokens />
            </Modal>
          </Col>
        </Row>
        <Table
          label="Balances"
          defaultOrderBy={BALANCE_TABLE_ASSET_ID}
          columns={columns}
          data={filteredData}
        >
          {(sortedData: Array<BalanceRow>) => sortedData.map((row: any, index: number) => (
            <TableRow tabIndex={-1} key={index} className={classes.hide}>
              { autoColumns.map((column: Column) => (
                <TableCell key={column.id} numeric={column.numeric} component="th" scope="row">
                  {row[column.id]}
                </TableCell>
              )) }
              <TableCell component="th" scope="row">
                <Row align="end" className={classes.actions}>
                  <Button variant="contained" size="small" color="secondary" className={classes.send}>
                    <CallMade className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Send
                  </Button>
                  <Button variant="contained" size="small" color="secondary" className={classes.receive}>
                    <CallReceived className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Receive
                  </Button>
                </Row>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Balances)
