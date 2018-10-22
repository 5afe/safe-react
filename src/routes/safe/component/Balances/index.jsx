// @flow
import * as React from 'react'
import { List } from 'immutable'
import classNames from 'classnames/bind'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import { type Column } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import { buildOrderFieldFrom } from '~/components/Table/sorting'
import { sm, xs } from '~/theme/variables'

const BALANCE_TABLE_ASSET_ID = 'asset'
const BALANCE_TABLE_BALANCE_ID = 'balance'
const BALANCE_TABLE_VALUE_ID = 'value'

const generateColumns = () => {
  const assetRow: Column = {
    id: BALANCE_TABLE_ASSET_ID,
    order: false,
    numeric: false,
    disablePadding: false,
    label: 'Asset',
    custom: false,
  }

  const balanceRow: Column = {
    id: BALANCE_TABLE_BALANCE_ID,
    order: true,
    numeric: true,
    disablePadding: false,
    label: 'Balance',
    custom: false,
  }

  const valueRow: Column = {
    id: BALANCE_TABLE_VALUE_ID,
    order: true,
    numeric: true,
    disablePadding: false,
    label: 'Value',
    custom: false,
  }

  const actions: Column = {
    id: 'actions',
    order: false,
    numeric: false,
    disablePadding: false,
    label: '',
    custom: true,
  }

  return List([assetRow, balanceRow, valueRow, actions])
}

type State = {
  hideZero: boolean,
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
  actions: {
    justifyContent: 'flex-end',
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
})

type Props = {
  classes: Object,
}

type BalanceRow = {
  asset: string,
  balance: string,
  balanceOrder: number,
  value: string,
  valueOrder: number,
}

class Balances extends React.Component<Props, State> {
  state = {
    hideZero: false,
  }

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { checked } = e.target

    this.setState(() => ({ hideZero: checked }))
  }

  render() {
    const { hideZero } = this.state
    const { classes } = this.props

    const columns = generateColumns()
    const autoColumns = columns.filter(c => !c.custom)
    const checkboxClasses = {
      root: classes.root,
    }

    return (
      <React.Fragment>
        <Row align="center" className={classes.message}>
          <Checkbox
            classes={checkboxClasses}
            checked={hideZero}
            onChange={this.handleChange}
            color="secondary"
            disableRipple
          />
          <Paragraph className={classes.zero}>Hide zero balances</Paragraph>
        </Row>
        <Table
          label="Balances"
          defaultOrderBy={BALANCE_TABLE_ASSET_ID}
          columns={columns}
          data={[
            {
              [BALANCE_TABLE_ASSET_ID]: 'Ethereum',
              [BALANCE_TABLE_BALANCE_ID]: '9.394 ETH',
              [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 9.394,
              [BALANCE_TABLE_VALUE_ID]: '$539.45',
              [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 539.45,
            },
            {
              [BALANCE_TABLE_ASSET_ID]: 'Gnosis',
              [BALANCE_TABLE_BALANCE_ID]: '0.599 GNO',
              [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 0.559,
              [BALANCE_TABLE_VALUE_ID]: '$23.11',
              [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 23.11,
            },
            {
              [BALANCE_TABLE_ASSET_ID]: 'OmiseGO',
              [BALANCE_TABLE_BALANCE_ID]: '39.922 OMG',
              [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 39.922,
              [BALANCE_TABLE_VALUE_ID]: '$2930.89',
              [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 2930.89,
            },
          ]}
        >
          {(sortedData: Array<BalanceRow>) => sortedData.map((row: any, index: number) => (
            <TableRow tabIndex={-1} key={index}>
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
