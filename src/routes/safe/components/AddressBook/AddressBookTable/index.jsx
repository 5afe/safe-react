// @flow
import React, { useEffect, useState } from 'react'

import cn from 'classnames'
import { List } from 'immutable'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames/bind'
import CallMade from '@material-ui/icons/CallMade'
import { useDispatch, useSelector } from 'react-redux'
import { withSnackbar } from 'notistack'
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
import Col from '~/components/layout/Col'
import ButtonLink from '~/components/layout/ButtonLink'
import CreateEditEntryModal from '~/routes/safe/components/AddressBook/AddressBookTable/CreateEditEntryModal'
import { getAddressBook } from '~/logic/addressBook/store/selectors'
import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'
import DeleteEntryModal from '~/routes/safe/components/AddressBook/AddressBookTable/DeleteEntryModal'
import { updateAddressBookEntry } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { removeAddressBookEntry } from '~/logic/addressBook/store/actions/removeAddressBookEntry'
import { addAddressBookEntry } from '~/logic/addressBook/store/actions/addAddressBookEntry'


type Props = {
  classes: Object,
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

  const addressBook = useSelector(getAddressBook)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)

  const newEntryModalHandler = (entry: AddressBookEntryType) => {
    setEditCreateEntryModalOpen(false)
    dispatch(addAddressBookEntry(entry))
  }

  const editEntryModalHandler = (entryRow: Object) => {
    const { index } = selectedEntry
    setSelectedEntry(null)
    setEditCreateEntryModalOpen(false)
    dispatch(updateAddressBookEntry(entryRow, index))
  }

  const deleteEntryModalHandler = () => {
    const { index } = selectedEntry
    setSelectedEntry(null)
    setDeleteEntryModalOpen(false)
    dispatch(removeAddressBookEntry(index))
  }

  return (
    <>
      <Row align="center" className={classes.message}>
        <Col xs={12} end="sm">
          <ButtonLink
            size="lg"
            onClick={() => {
              setSelectedEntry(null)
              setEditCreateEntryModalOpen(!editCreateEntryModalOpen)
            }}
            testId="manage-tokens-btn"
          >
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
          disableLoadingOnEmptyTable
          defaultRowsPerPage={25}
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
                    onClick={() => {
                      setSelectedEntry({ entry: row, index })
                      setEditCreateEntryModalOpen(true)
                    }}
                    testId={EDIT_ENTRY_BUTTON}
                  />
                  <Img
                    alt="Remove entry"
                    className={classes.removeEntryButton}
                    src={RemoveOwnerIcon}
                    onClick={() => {
                      setSelectedEntry({ entry: row, index })
                      setDeleteEntryModalOpen(true)
                    }}
                    testId={REMOVE_ENTRY_BUTTON}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    className={classes.send}
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
      <CreateEditEntryModal
        onClose={() => setEditCreateEntryModalOpen(false)}
        isOpen={editCreateEntryModalOpen}
        newEntryModalHandler={newEntryModalHandler}
        editEntryModalHandler={editEntryModalHandler}
        entryToEdit={selectedEntry}
      />
      <DeleteEntryModal
        onClose={() => setDeleteEntryModalOpen(false)}
        isOpen={deleteEntryModalOpen}
        deleteEntryModalHandler={deleteEntryModalHandler}
        entryToDelete={selectedEntry}
      />
    </>
  )
}

export default withStyles(styles)(withSnackbar(AddressBookTable))
