// @flow
import React from 'react'

import cn from 'classnames'
import { List } from 'immutable'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames/bind'
import CallMade from '@material-ui/icons/CallMade'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Table from '~/components/Table'
import Button from '~/components/layout/Button'

import { styles } from './style'
import type { OwnerRow } from '~/routes/safe/components/Settings/ManageOwners/dataFetcher'
import OwnerAddressTableCell from '~/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import Img from '~/components/layout/Img'
import RenameOwnerIcon from '~/routes/safe/components/Settings/ManageOwners/assets/icons/rename-owner.svg'
import RemoveOwnerIcon from '~/routes/safe/components/Settings/assets/icons/bin.svg'
import {
  ADDRESS_BOOK_ROW_ID,
  EDIT_ENTRY_BUTTON,
  generateColumns, REMOVE_ENTRY_BUTTON, SEND_ENTRY_BUTTON,
} from '~/routes/safe/components/AddressBook/AddressBookTable/columns'


type Props = {
  classes: Object
}


const AddressBookTable = ({
  classes,
}: Props) => {
  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)


  const ownerData1 = [{ address: '123', name: 'test' }, { address: '123', name: 'test' }]
  const ownerData = List(ownerData1)

  return (
    <>
      <Block className={classes.formContainer}>
        <Table
          label="Owners"
          columns={columns}
          data={ownerData}
          size={ownerData.size}
          disablePagination
          defaultFixed
          noBorder
        >
          {(sortedData: List<OwnerRow>) => sortedData.map((row: any, index: number) => (
            <TableRow
              tabIndex={-1}
              key={index}
              className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
              data-testid={ADDRESS_BOOK_ROW_ID}
            >
              {autoColumns.map((column: Column) => (
                <TableCell key={column.id} style={cellWidth(column.width)} align={column.align} component="td">
                  {column.id === ADDRESS_BOOK_ROW_ID ? (
                    <OwnerAddressTableCell address={row[column.id]} />
                  ) : (
                    row[column.id]
                  )}
                </TableCell>
              ))}
              <TableCell component="td">
                <Row align="end" className={classes.actions}>
                  <Img
                    alt="Edit entry"
                    className={classes.editOwnerIcon}
                    src={RenameOwnerIcon}
                    onClick={() => {}}
                    testId={EDIT_ENTRY_BUTTON}
                  />
                  <Img
                    alt="Remove entry"
                    className={classes.removeOwnerIcon}
                    src={RemoveOwnerIcon}
                    onClick={() => {}}
                    testId={REMOVE_ENTRY_BUTTON}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    className={classes.send}
                    onClick={() => {}}
                    testId={SEND_ENTRY_BUTTON}
                  >
                    <CallMade alt="Send Transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Send
                  </Button>
                </Row>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Block>
    </>
  )
}

export default withStyles(styles)(AddressBookTable)
