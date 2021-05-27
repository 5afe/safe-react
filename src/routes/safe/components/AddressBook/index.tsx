import { Button, EthHashInfo, FixedIcon, Text } from '@gnosis.pm/safe-react-components'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import styled from 'styled-components'
import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'

import { getExplorerInfo } from 'src/config'
import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addAddressBookEntry } from 'src/logic/addressBook/store/actions/addAddressBookEntry'
import { removeAddressBookEntry } from 'src/logic/addressBook/store/actions/removeAddressBookEntry'
import { updateAddressBookEntry } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { isUserAnOwnerOfAnySafe, sameAddress } from 'src/logic/wallets/ethAddresses'
import { CreateEditEntryModal } from 'src/routes/safe/components/AddressBook/CreateEditEntryModal'
import { DeleteEntryModal } from 'src/routes/safe/components/AddressBook/DeleteEntryModal'
import {
  AB_ADDRESS_ID,
  ADDRESS_BOOK_ROW_ID,
  EDIT_ENTRY_BUTTON,
  REMOVE_ENTRY_BUTTON,
  SEND_ENTRY_BUTTON,
  generateColumns,
} from 'src/routes/safe/components/AddressBook/columns'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import RenameOwnerIcon from 'src/routes/safe/components/Settings/ManageOwners/assets/icons/rename-owner.svg'
import RemoveOwnerIcon from 'src/routes/safe/components/Settings/assets/icons/bin.svg'
import { addressBookQueryParamsSelector, safesListSelector } from 'src/logic/safe/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

const StyledButton = styled(Button)`
  &&.MuiButton-root {
    margin: 4px 12px 4px 0px;
    padding: 0 12px;
    min-width: auto;
  }
  svg {
    margin: 0 6px 0 0;
  }
`
const useStyles = makeStyles(styles)

interface AddressBookSelectedEntry extends AddressBookEntry {
  isNew?: boolean
}

export type Entry = {
  entry: AddressBookSelectedEntry
  index?: number
  isOwnerAddress?: boolean
}

const initialEntryState: Entry = { entry: { address: '', name: '', isNew: true } }

const AddressBookTable = (): ReactElement => {
  const classes = useStyles()
  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)
  const dispatch = useDispatch()
  const safesList = useSelector(safesListSelector)
  const entryAddressToEditOrCreateNew = useSelector(addressBookQueryParamsSelector)
  const addressBook = useSelector(addressBookSelector)
  const granted = useSelector(grantedSelector)
  const [selectedEntry, setSelectedEntry] = useState<Entry>(initialEntryState)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)
  const [sendFundsModalOpen, setSendFundsModalOpen] = useState(false)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'AddressBook' })
  }, [trackEvent])

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      setEditCreateEntryModalOpen(true)
    }
  }, [entryAddressToEditOrCreateNew])

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      const address = checksumAddress(entryAddressToEditOrCreateNew)
      const oldEntryIndex = addressBook.findIndex((entry) => sameAddress(entry.address, address))

      if (oldEntryIndex >= 0) {
        // Edit old entry
        setSelectedEntry({ entry: addressBook[oldEntryIndex], index: oldEntryIndex })
      } else {
        // Create new entry
        setSelectedEntry({
          entry: {
            name: '',
            address,
            isNew: true,
          },
        })
      }
    }
  }, [addressBook, entryAddressToEditOrCreateNew])

  const newEntryModalHandler = (entry: AddressBookEntry) => {
    setEditCreateEntryModalOpen(false)
    const checksumEntries = {
      ...entry,
      address: checksumAddress(entry.address),
    }
    dispatch(addAddressBookEntry(makeAddressBookEntry(checksumEntries)))
  }

  const editEntryModalHandler = (entry: AddressBookEntry) => {
    setSelectedEntry(initialEntryState)
    setEditCreateEntryModalOpen(false)
    const checksumEntries = {
      ...entry,
      address: checksumAddress(entry.address),
    }
    dispatch(updateAddressBookEntry(makeAddressBookEntry(checksumEntries)))
  }

  const deleteEntryModalHandler = () => {
    const entryAddress = selectedEntry?.entry ? checksumAddress(selectedEntry.entry.address) : ''
    setSelectedEntry(initialEntryState)
    setDeleteEntryModalOpen(false)
    dispatch(removeAddressBookEntry(entryAddress))
  }

  return (
    <>
      <Row align="center" className={classes.message}>
        <Col end="sm" xs={12}>
          <ButtonLink
            onClick={() => {
              setSelectedEntry(initialEntryState)
              setEditCreateEntryModalOpen(true)
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
            size={addressBook?.length || 0}
          >
            {(sortedData) =>
              sortedData.map((row, index) => {
                const userOwner = isUserAnOwnerOfAnySafe(safesList, row.address)
                const hideBorderBottom = index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom
                return (
                  <TableRow
                    className={cn(classes.hide, hideBorderBottom)}
                    data-testid={ADDRESS_BOOK_ROW_ID}
                    key={index}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column) => {
                      return (
                        <TableCell align={column.align} component="td" key={column.id} style={cellWidth(column.width)}>
                          {column.id === AB_ADDRESS_ID ? (
                            <Block justify="left">
                              <EthHashInfo
                                hash={row[column.id]}
                                showCopyBtn
                                showAvatar
                                explorerUrl={getExplorerInfo(row[column.id])}
                              />
                            </Block>
                          ) : (
                            row[column.id]
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell component="td">
                      <Row align="end" className={classes.actions}>
                        <Img
                          alt="Edit entry"
                          className={granted ? classes.editEntryButton : classes.editEntryButtonNonOwner}
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
                          className={granted ? classes.removeEntryButton : classes.removeEntryButtonNonOwner}
                          onClick={() => {
                            setSelectedEntry({ entry: row })
                            setDeleteEntryModalOpen(true)
                          }}
                          src={RemoveOwnerIcon}
                          testId={REMOVE_ENTRY_BUTTON}
                        />
                        {granted ? (
                          <StyledButton
                            color="primary"
                            onClick={() => {
                              setSelectedEntry({ entry: row })
                              setSendFundsModalOpen(true)
                            }}
                            size="md"
                            variant="contained"
                            data-testid={SEND_ENTRY_BUTTON}
                          >
                            <FixedIcon type="arrowSentWhite" />
                            <Text size="xl" color="white">
                              Send
                            </Text>
                          </StyledButton>
                        ) : null}
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
        recipientAddress={selectedEntry?.entry?.address}
        recipientName={selectedEntry?.entry?.name}
      />
    </>
  )
}

export default AddressBookTable
