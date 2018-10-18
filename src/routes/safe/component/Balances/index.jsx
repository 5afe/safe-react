// @flow
import * as React from 'react'
import { List } from 'immutable'
import Row from '~/components/layout/Row'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import { type Column } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import { buildOrderFieldFrom } from '~/components/Table/sorting'
import { sm } from '~/theme/variables'

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
  }

  const balanceRow: Column = {
    id: BALANCE_TABLE_BALANCE_ID,
    order: true,
    numeric: true,
    disablePadding: false,
    label: 'Balance',
  }

  const valueRow: Column = {
    id: BALANCE_TABLE_VALUE_ID,
    order: true,
    numeric: true,
    disablePadding: false,
    label: 'Value',
  }

  return List([assetRow, balanceRow, valueRow])
}

type State = {
  hideZero: boolean,
}

const styles = {
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
}

type Props = {
  classes: Object,
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
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Balances)
