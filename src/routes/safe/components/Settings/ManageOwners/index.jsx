// @flow
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { List } from 'immutable'
import React from 'react'

import RemoveOwnerIcon from '../assets/icons/bin.svg'

import AddOwnerModal from './AddOwnerModal'
import EditOwnerModal from './EditOwnerModal'
import OwnerAddressTableCell from './OwnerAddressTableCell'
import RemoveOwnerModal from './RemoveOwnerModal'
import ReplaceOwnerModal from './ReplaceOwnerModal'
import RenameOwnerIcon from './assets/icons/rename-owner.svg'
import ReplaceOwnerIcon from './assets/icons/replace-owner.svg'
import {
  OWNERS_TABLE_ADDRESS_ID,
  OWNERS_TABLE_NAME_ID,
  type OwnerRow,
  generateColumns,
  getOwnerData,
} from './dataFetcher'
import { styles } from './style'

import Table from '~/components/Table'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Heading from '~/components/layout/Heading'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph/index'
import Row from '~/components/layout/Row'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'
import { getOwnersWithNameFromAddressBook } from '~/logic/addressBook/utils'
import type { Owner } from '~/routes/safe/store/models/owner'

export const RENAME_OWNER_BTN_TEST_ID = 'rename-owner-btn'
export const REMOVE_OWNER_BTN_TEST_ID = 'remove-owner-btn'
export const ADD_OWNER_BTN_TEST_ID = 'add-owner-btn'
export const REPLACE_OWNER_BTN_TEST_ID = 'replace-owner-btn'
export const OWNERS_ROW_TEST_ID = 'owners-row'

type Props = {
  classes: Object,
  owners: List<Owner>,
  addressBook: AddressBook,
  granted: boolean,
}

type State = {
  selectedOwnerAddress?: string,
  selectedOwnerName?: string,
  showAddOwner: boolean,
  showRemoveOwner: boolean,
  showReplaceOwner: boolean,
  showEditOwner: boolean,
}

type Action = 'AddOwner' | 'EditOwner' | 'ReplaceOwner' | 'RemoveOwner'

class ManageOwners extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      selectedOwnerAddress: undefined,
      selectedOwnerName: undefined,
      showAddOwner: false,
      showRemoveOwner: false,
      showReplaceOwner: false,
      showEditOwner: false,
    }
  }

  onShow = (action: Action, row?: Object) => () => {
    this.setState({
      [`show${action}`]: true,
      selectedOwnerAddress: row && row.address,
      selectedOwnerName: row && row.name,
    })
  }

  onHide = (action: Action) => () => {
    this.setState({
      [`show${action}`]: false,
      selectedOwnerAddress: undefined,
      selectedOwnerName: undefined,
    })
  }

  render() {
    const { addressBook, classes, granted, owners } = this.props
    const {
      selectedOwnerAddress,
      selectedOwnerName,
      showAddOwner,
      showEditOwner,
      showRemoveOwner,
      showReplaceOwner,
    } = this.state
    const columns = generateColumns()
    const autoColumns = columns.filter((c) => !c.custom)
    const ownersAdbk = getOwnersWithNameFromAddressBook(addressBook, owners)
    const ownerData = getOwnerData(ownersAdbk)

    return (
      <>
        <Block className={classes.formContainer}>
          <Heading className={classes.title} tag="h2">
            Manage Safe Owners
          </Heading>
          <Paragraph className={classes.annotation}>
            Add, remove and replace owners or rename existing owners. Owner names are only stored locally and never
            shared with Gnosis or any third parties.
          </Paragraph>
          <TableContainer>
            <Table
              columns={columns}
              data={ownerData}
              defaultFixed
              defaultOrderBy={OWNERS_TABLE_NAME_ID}
              disablePagination
              label="Owners"
              noBorder
              size={ownerData.size}
            >
              {(sortedData: List<OwnerRow>) =>
                sortedData.map((row: any, index: number) => (
                  <TableRow
                    className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
                    data-testid={OWNERS_ROW_TEST_ID}
                    key={index}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column: Column) => (
                      <TableCell align={column.align} component="td" key={column.id} style={cellWidth(column.width)}>
                        {column.id === OWNERS_TABLE_ADDRESS_ID ? (
                          <OwnerAddressTableCell address={row[column.id]} />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                    <TableCell component="td">
                      <Row align="end" className={classes.actions}>
                        <Img
                          alt="Edit owner"
                          className={classes.editOwnerIcon}
                          onClick={this.onShow('EditOwner', row)}
                          src={RenameOwnerIcon}
                          testId={RENAME_OWNER_BTN_TEST_ID}
                        />
                        {granted && (
                          <>
                            <Img
                              alt="Replace owner"
                              className={classes.replaceOwnerIcon}
                              onClick={this.onShow('ReplaceOwner', row)}
                              src={ReplaceOwnerIcon}
                              testId={REPLACE_OWNER_BTN_TEST_ID}
                            />
                            {ownerData.size > 1 && (
                              <Img
                                alt="Remove owner"
                                className={classes.removeOwnerIcon}
                                onClick={this.onShow('RemoveOwner', row)}
                                src={RemoveOwnerIcon}
                                testId={REMOVE_OWNER_BTN_TEST_ID}
                              />
                            )}
                          </>
                        )}
                      </Row>
                    </TableCell>
                  </TableRow>
                ))
              }
            </Table>
          </TableContainer>
        </Block>
        {granted && (
          <>
            <Hairline />
            <Row align="end" className={classes.controlsRow} grow>
              <Col end="xs">
                <Button
                  color="primary"
                  onClick={this.onShow('AddOwner')}
                  size="small"
                  testId={ADD_OWNER_BTN_TEST_ID}
                  variant="contained"
                >
                  Add new owner
                </Button>
              </Col>
            </Row>
          </>
        )}
        <AddOwnerModal isOpen={showAddOwner} onClose={this.onHide('AddOwner')} />
        <RemoveOwnerModal
          isOpen={showRemoveOwner}
          onClose={this.onHide('RemoveOwner')}
          ownerAddress={selectedOwnerAddress}
          ownerName={selectedOwnerName}
        />
        <ReplaceOwnerModal
          isOpen={showReplaceOwner}
          onClose={this.onHide('ReplaceOwner')}
          ownerAddress={selectedOwnerAddress}
          ownerName={selectedOwnerName}
        />
        <EditOwnerModal
          isOpen={showEditOwner}
          onClose={this.onHide('EditOwner')}
          ownerAddress={selectedOwnerAddress}
          selectedOwnerName={selectedOwnerName}
        />
      </>
    )
  }
}

export default withStyles(styles)(ManageOwners)
