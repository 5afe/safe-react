// @flow
import React, { useState } from 'react'

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
} from '~/routes/safe/components/AddressBook/columns'
import Col from '~/components/layout/Col'
import ButtonLink from '~/components/layout/ButtonLink'
import CreateEditEntryModal from '~/routes/safe/components/AddressBook/CreateEditEntryModal'
import { getAddressBook } from '~/logic/addressBook/store/selectors'
import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'
import DeleteEntryModal from '~/routes/safe/components/AddressBook/DeleteEntryModal'
import { updateAddressBookEntry } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { removeAddressBookEntry } from '~/logic/addressBook/store/actions/removeAddressBookEntry'
import { addAddressBookEntry } from '~/logic/addressBook/store/actions/addAddressBookEntry'
import SendModal from '~/routes/safe/components/Balances/SendModal'
import {
  safeSelector,
} from '~/routes/safe/store/selectors'
import { extendedSafeTokensSelector } from '~/routes/safe/container/selector'


type Props = {
  classes: Object,
}


const AddressBookTable = ({
  classes,
}: Props) => {
  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const dispatch = useDispatch()

  const addressBookObj = useSelector(getAddressBook)
  const addressBook = List(addressBookObj)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)
  const [sendFundsModalOpen, setSendFundsModalOpen] = useState(false)

  const safe = useSelector(safeSelector)
  const activeTokens = useSelector(extendedSafeTokensSelector)
  const {
    address, ethBalance, name,
  } = safe

  const newEntryModalHandler = (entry: AddressBookEntryType) => {
    setEditCreateEntryModalOpen(false)
    dispatch(addAddressBookEntry(entry))
  }

  const editEntryModalHandler = (entry: AddressBookEntryType) => {
    setSelectedEntry(null)
    setEditCreateEntryModalOpen(false)
    dispatch(updateAddressBookEntry(entry))
  }

  const deleteEntryModalHandler = () => {
    const entryAddress = selectedEntry.entry.address
    setSelectedEntry(null)
    setDeleteEntryModalOpen(false)
    dispatch(removeAddressBookEntry(entryAddress))
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
                      setSelectedEntry({ entry: row })
                      setEditCreateEntryModalOpen(true)
                    }}
                    testId={EDIT_ENTRY_BUTTON}
                  />
                  <Img
                    alt="Remove entry"
                    className={classes.removeEntryButton}
                    src={RemoveOwnerIcon}
                    onClick={() => {
                      setSelectedEntry({ entry: row })
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
                    onClick={() => {
                      setSelectedEntry({ entry: row })
                      setSendFundsModalOpen(true)
                    }}
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
      <SendModal
        onClose={() => setSendFundsModalOpen(false)}
        isOpen={sendFundsModalOpen}
        safeAddress={address}
        safeName={name}
        ethBalance={ethBalance}
        tokens={activeTokens}
        activeScreenType="sendFunds"
        recipientAddress={selectedEntry && selectedEntry.entry ? selectedEntry.entry.address : undefined}
      />
    </>
  )
}

export default withStyles(styles)(AddressBookTable)
