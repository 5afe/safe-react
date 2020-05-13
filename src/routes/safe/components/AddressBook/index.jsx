// @flow
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import CallMade from '@material-ui/icons/CallMade'
import cn from 'classnames'
import classNames from 'classnames/bind'
import { List } from 'immutable'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'

import Table from '~/components/Table'
import { type Column, cellWidth } from '~/components/Table/TableHead'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import type { AddressBookEntry } from '~/logic/addressBook/model/addressBook'
import { makeAddressBookEntry } from '~/logic/addressBook/model/addressBook'
import { addAddressBookEntry } from '~/logic/addressBook/store/actions/addAddressBookEntry'
import { removeAddressBookEntry } from '~/logic/addressBook/store/actions/removeAddressBookEntry'
import { updateAddressBookEntry } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { getAddressBookListSelector } from '~/logic/addressBook/store/selectors'
import { isUserOwnerOnAnySafe } from '~/logic/wallets/ethAddresses'
import CreateEditEntryModal from '~/routes/safe/components/AddressBook/CreateEditEntryModal'
import DeleteEntryModal from '~/routes/safe/components/AddressBook/DeleteEntryModal'
import {
  AB_ADDRESS_ID,
  ADDRESS_BOOK_ROW_ID,
  EDIT_ENTRY_BUTTON,
  REMOVE_ENTRY_BUTTON,
  SEND_ENTRY_BUTTON,
  generateColumns,
} from '~/routes/safe/components/AddressBook/columns'
import SendModal from '~/routes/safe/components/Balances/SendModal'
import OwnerAddressTableCell from '~/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import RenameOwnerIcon from '~/routes/safe/components/Settings/ManageOwners/assets/icons/rename-owner.svg'
import type { OwnerRow } from '~/routes/safe/components/Settings/ManageOwners/dataFetcher'
import RemoveOwnerIcon from '~/routes/safe/components/Settings/assets/icons/bin.svg'
import RemoveOwnerIconDisabled from '~/routes/safe/components/Settings/assets/icons/disabled-bin.svg'
import { addressBookQueryParamsSelector, safesListSelector } from '~/routes/safe/store/selectors'
import { checksumAddress } from '~/utils/checksumAddress'

type Props = {
  classes: Object,
}

const AddressBookTable = ({ classes }: Props) => {
  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const dispatch = useDispatch()
  const safesList = useSelector(safesListSelector)
  const entryAddressToEditOrCreateNew = useSelector(addressBookQueryParamsSelector)
  const addressBook = useSelector(getAddressBookListSelector)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)
  const [sendFundsModalOpen, setSendFundsModalOpen] = useState(false)

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      setEditCreateEntryModalOpen(true)
    }
  }, [])

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      const checksumEntryAdd = checksumAddress(entryAddressToEditOrCreateNew)
      const key = addressBook.findKey((entry) => entry.address === checksumEntryAdd)
      if (key >= 0) {
        // Edit old entry
        const value = addressBook.get(key)
        setSelectedEntry({ entry: value, index: key })
      } else {
        // Create new entry
        setSelectedEntry({
          entry: {
            name: '',
            address: checksumEntryAdd,
            isNew: true,
          },
        })
      }
    }
  }, [addressBook])

  const newEntryModalHandler = (entry: AddressBookEntry) => {
    setEditCreateEntryModalOpen(false)
    const checksumEntries = {
      ...entry,
      address: checksumAddress(entry.address),
    }
    dispatch(addAddressBookEntry(makeAddressBookEntry(checksumEntries)))
  }

  const editEntryModalHandler = (entry: AddressBookEntry) => {
    setSelectedEntry(null)
    setEditCreateEntryModalOpen(false)
    const checksumEntries = {
      ...entry,
      address: checksumAddress(entry.address),
    }
    dispatch(updateAddressBookEntry(makeAddressBookEntry(checksumEntries)))
  }

  const deleteEntryModalHandler = () => {
    const entryAddress = checksumAddress(selectedEntry.entry.address)
    setSelectedEntry(null)
    setDeleteEntryModalOpen(false)
    dispatch(removeAddressBookEntry(entryAddress))
  }

  return (
    <>
      <Row align="center" className={classes.message}>
        <Col end="sm" xs={12}>
          <ButtonLink
            onClick={() => {
              setSelectedEntry(null)
              setEditCreateEntryModalOpen(!editCreateEntryModalOpen)
            }}
            size="lg"
            testId="manage-tokens-btn"
          >
            + Create entry
          </ButtonLink>
        </Col>
      </Row>
      <Block className={classes.formContainer}>
        <TableContainer>
          <Table
            columns={columns}
            data={addressBook}
            defaultFixed
            defaultRowsPerPage={25}
            disableLoadingOnEmptyTable
            label="Owners"
            size={addressBook.size}
          >
            {(sortedData: List<OwnerRow>) =>
              sortedData.map((row: AddressBookEntry, index: number) => {
                const userOwner = isUserOwnerOnAnySafe(safesList, row.address)
                const hideBorderBottom = index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom
                return (
                  <TableRow
                    className={cn(classes.hide, hideBorderBottom)}
                    data-testid={ADDRESS_BOOK_ROW_ID}
                    key={index}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column: Column) => (
                      <TableCell align={column.align} component="td" key={column.id} style={cellWidth(column.width)}>
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
                          onClick={() => {
                            setSelectedEntry({
                              entry: row,
                              isOwnerAddress: userOwner,
                            })
                            setEditCreateEntryModalOpen(true)
                          }}
                          src={RenameOwnerIcon}
                          testId={EDIT_ENTRY_BUTTON}
                        />
                        <Img
                          alt="Remove entry"
                          className={userOwner ? classes.removeEntryButtonDisabled : classes.removeEntryButton}
                          onClick={() => {
                            if (!userOwner) {
                              setSelectedEntry({ entry: row })
                              setDeleteEntryModalOpen(true)
                            }
                          }}
                          src={userOwner ? RemoveOwnerIconDisabled : RemoveOwnerIcon}
                          testId={REMOVE_ENTRY_BUTTON}
                        />
                        <Button
                          className={classes.send}
                          color="primary"
                          onClick={() => {
                            setSelectedEntry({ entry: row })
                            setSendFundsModalOpen(true)
                          }}
                          size="small"
                          testId={SEND_ENTRY_BUTTON}
                          variant="contained"
                        >
                          <CallMade
                            alt="Send Transaction"
                            className={classNames(classes.leftIcon, classes.iconSmall)}
                          />
                          Send
                        </Button>
                      </Row>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </Table>
        </TableContainer>
      </Block>
      <CreateEditEntryModal
        editEntryModalHandler={editEntryModalHandler}
        entryToEdit={selectedEntry}
        isOpen={editCreateEntryModalOpen}
        newEntryModalHandler={newEntryModalHandler}
        onClose={() => setEditCreateEntryModalOpen(false)}
      />
      <DeleteEntryModal
        deleteEntryModalHandler={deleteEntryModalHandler}
        entryToDelete={selectedEntry}
        isOpen={deleteEntryModalOpen}
        onClose={() => setDeleteEntryModalOpen(false)}
      />
      <SendModal
        activeScreenType="chooseTxType"
        isOpen={sendFundsModalOpen}
        onClose={() => setSendFundsModalOpen(false)}
        recipientAddress={selectedEntry && selectedEntry.entry ? selectedEntry.entry.address : undefined}
      />
    </>
  )
}

export default withStyles(styles)(AddressBookTable)
