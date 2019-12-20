// @flow
import React, { useEffect } from 'react'

import cn from 'classnames'
import { List } from 'immutable'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames/bind'
import CallMade from '@material-ui/icons/CallMade'
import { useDispatch, useSelector } from 'react-redux'
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
  AB_ADDRESS_ID,
  ADDRESS_BOOK_ROW_ID,
  EDIT_ENTRY_BUTTON,
  generateColumns, REMOVE_ENTRY_BUTTON, SEND_ENTRY_BUTTON,
} from '~/routes/safe/components/AddressBook/AddressBookTable/columns'
import loadAddressBook from '~/logic/addressBook/store/actions/loadAddressBook'
import { getAddressBookListSelector } from '~/logic/addressBook/store/selectors'
import Col from '~/components/layout/Col'
import ButtonLink from '~/components/layout/ButtonLink'


type Props = {
  classes: Object
}


const AddressBookTable = ({
  classes,
}: Props) => {
  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadAddressBook())
  }, [])

  const addressBook = useSelector(getAddressBookListSelector)

  return (
    <>
      <Row align="center" className={classes.message}>
        <Col xs={12} end="sm">
          <ButtonLink size="lg" onClick={() => {}} testId="manage-tokens-btn">
            + Create entry
          </ButtonLink>
        </Col>
      </Row>
      <Block className={classes.formContainer}>
        <Table
          label="Owners"
          columns={columns}
          data={addressBook}
          size={addressBook.size}
          defaultFixed
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
                  {column.id === AB_ADDRESS_ID ? (
                    <OwnerAddressTableCell address={row[column.id]} showLinks />
                  ) : (
                    row[column.id]
                  )}
                </TableCell>
              ))}
              <TableCell component="td">
                <Row align="end" className={classes.actions}>
                  <Img
                    alt="Edit entry"
                    className={classes.editEntryButton}
                    src={RenameOwnerIcon}
                    onClick={() => {}}
                    testId={EDIT_ENTRY_BUTTON}
                  />
                  <Img
                    alt="Remove entry"
                    className={classes.removeEntryButton}
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
