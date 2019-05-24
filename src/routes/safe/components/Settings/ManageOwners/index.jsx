// @flow
import React from 'react'
import classNames from 'classnames'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Field from '~/components/forms/Field'
import {
  composeValidators, required, minMaxLength,
} from '~/components/forms/validator'
import Table from '~/components/Table'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TextField from '~/components/forms/TextField'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import AddOwnerModal from './AddOwnerModal'
import OwnerAddressTableCell from './OwnerAddressTableCell'
import type { Owner } from '~/routes/safe/store/models/owner'
import { getOwnerData, generateColumns, OWNERS_TABLE_ADDRESS_ID, type OwnerRow, } from './dataFetcher'
import { sm, boldFont } from '~/theme/variables'
import { styles } from './style'

const controlsStyle = {
  backgroundColor: 'white',
  padding: sm,
}

const addOwnerButtonStyle = {
  marginRight: sm,
  fontWeight: boldFont,
}

type Props = {
  classes: Object,
  safeAddress: string,
  safeName: string,
  owners: List<Owner>,
  network: string,
  userAddress: string,
  createTransaction: Function,
}

type Action = 'AddOwner' | 'EditOwner' | 'ReplaceOwner' | 'RemoveOwner'

class ManageOwners extends React.Component<Props, State> {
  state = {
    showAddOwner: false,
  }

  onShow = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: true }))
  }

  onHide = (action: Action) => () => {
    this.setState(() => ({ [`show${action}`]: false }))
  }

  render() {
    const {
      classes,
      safeAddress,
      safeName,
      owners,
      threshold,
      network,
      userAddress,
      createTransaction,
    } = this.props
    const { showAddOwner } = this.state

    const columns = generateColumns()
    const ownerData = getOwnerData(owners)

    return (
      <React.Fragment>
        <Block className={classes.formContainer}>
          <Paragraph noMargin className={classes.title} size="lg" weight="bolder">
            Manage Safe Owners
          </Paragraph>

          <Table
            label="owners"
            columns={columns}
            data={ownerData}
            size={ownerData.size}
            defaultFixed
            noBorder
          >
            {(sortedData: Array<OwnerRow>) => sortedData.map((row: any, index: number) => (
              <TableRow tabIndex={-1} key={index} className={classes.hide}>
                {columns.map((column: Column) => (
                  <TableCell key={column.id} style={cellWidth(column.width)} align={column.align} component="td">
                    {column.id === OWNERS_TABLE_ADDRESS_ID ? <OwnerAddressTableCell address={row[column.id]} /> : row[column.id]}
                  </TableCell>
                ))}
                <TableCell component="td">
                  <Row align="end" className={classes.actions}>
                    <Button
                      onClick={this.onShow('EditOwner')}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={this.onShow('ReplaceOwner')}
                    >
                      Replace
                    </Button>
                    <Button
                      onClick={this.onShow('RemoveOwner')}
                    >
                      Remove
                    </Button>
                  </Row>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Block>
        <Hairline />
        <Row style={controlsStyle} align="end" grow>
          <Col end="xs">
            <Button
              style={addOwnerButtonStyle}
              size="small"
              variant="contained"
              color="primary"
              onClick={this.onShow('AddOwner')}
            >
              Add new owner
            </Button>
          </Col>
        </Row>
        <AddOwnerModal
          onClose={this.onHide('AddOwner')}
          isOpen={showAddOwner}
          safeAddress={safeAddress}
          safeName={safeName}
          owners={owners}
          threshold={threshold}
          network={network}
          userAddress={userAddress}
          createTransaction={createTransaction}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(ManageOwners)
