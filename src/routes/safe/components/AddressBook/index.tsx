import {
  Breadcrumb,
  BreadcrumbElement,
  Button,
  ButtonLink,
  FixedIcon,
  Icon,
  Menu,
  Text,
} from '@gnosis.pm/safe-react-components'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import styled from 'styled-components'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'
import { getExplorerInfo } from 'src/config'
import ButtonHelper from 'src/components/ButtonHelper'
import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookAddOrUpdate, addressBookImport, addressBookRemove } from 'src/logic/addressBook/store/actions'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { isUserAnOwnerOfAnySafe, sameAddress } from 'src/logic/wallets/ethAddresses'
import { CreateEditEntryModal } from 'src/routes/safe/components/AddressBook/CreateEditEntryModal'
import { ExportEntriesModal } from 'src/routes/safe/components/AddressBook/ExportEntriesModal'
import { DeleteEntryModal } from 'src/routes/safe/components/AddressBook/DeleteEntryModal'
import {
  AB_NAME_ID,
  AB_ADDRESS_ID,
  ADDRESS_BOOK_ROW_ID,
  SEND_ENTRY_BUTTON,
  generateColumns,
} from 'src/routes/safe/components/AddressBook/columns'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { safesAsList } from 'src/logic/safe/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import { grantedSelector } from 'src/routes/safe/container/selector'
import ImportEntriesModal from './ImportEntriesModal'
import { isValidAddress } from 'src/utils/isValidAddress'
import { useHistory } from 'react-router'
import { currentChainId } from 'src/logic/config/store/selectors'
import { ADDRESS_BOOK_EVENTS } from 'src/utils/events/addressBook'
import Track from 'src/components/Track'

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

const AddressBookTable = (): ReactElement => {
  const classes = useStyles()
  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)
  const dispatch = useDispatch()
  const safesList = useSelector(safesAsList)
  const addressBook = useSelector(currentNetworkAddressBook)
  const networkId = useSelector(currentChainId)
  const granted = useSelector(grantedSelector)
  const chainId = useSelector(currentChainId)
  const initialEntryState: Entry = { entry: { address: '', name: '', chainId, isNew: true } }
  const [selectedEntry, setSelectedEntry] = useState<Entry>(initialEntryState)
  const [editCreateEntryModalOpen, setEditCreateEntryModalOpen] = useState(false)
  const [importEntryModalOpen, setImportEntryModalOpen] = useState(false)
  const [deleteEntryModalOpen, setDeleteEntryModalOpen] = useState(false)
  const [exportEntriesModalOpen, setExportEntriesModalOpen] = useState(false)
  const [sendFundsModalOpen, setSendFundsModalOpen] = useState(false)

  const history = useHistory()
  const queryParams = Object.fromEntries(new URLSearchParams(history.location.search))
  const entryAddressToEditOrCreateNew = queryParams?.entryAddress

  useEffect(() => {
    if (entryAddressToEditOrCreateNew) {
      setEditCreateEntryModalOpen(true)
    }
  }, [entryAddressToEditOrCreateNew])

  useEffect(() => {
    if (isValidAddress(entryAddressToEditOrCreateNew)) {
      const address = checksumAddress(entryAddressToEditOrCreateNew as string)
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
            chainId: networkId,
            isNew: true,
          },
        })
      }
    }
  }, [addressBook, entryAddressToEditOrCreateNew, networkId])

  const newEntryModalHandler = (entry: AddressBookEntry) => {
    // close the modal
    setEditCreateEntryModalOpen(false)
    // update the store
    dispatch(
      addressBookAddOrUpdate(makeAddressBookEntry({ ...entry, address: checksumAddress(entry.address), chainId })),
    )
  }

  const editEntryModalHandler = (entry: AddressBookEntry) => {
    // reset the form
    setSelectedEntry(initialEntryState)
    // close the modal
    setEditCreateEntryModalOpen(false)
    // update the store
    dispatch(
      addressBookAddOrUpdate(makeAddressBookEntry({ ...entry, address: checksumAddress(entry.address), chainId })),
    )
  }

  const deleteEntryModalHandler = () => {
    // reset the form
    setSelectedEntry(initialEntryState)
    // close the modal
    setDeleteEntryModalOpen(false)
    // update the store
    selectedEntry?.entry && dispatch(addressBookRemove(selectedEntry.entry))
  }

  const importEntryModalHandler = (addressList: AddressBookEntry[]) => {
    dispatch(addressBookImport(addressList))
    setImportEntryModalOpen(false)
  }

  return (
    <>
      <Menu>
        <Col start="sm" sm={6} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="addressBook" text="Address Book" counter={addressBook?.length.toString()} />
          </Breadcrumb>
        </Col>
        <Col end="sm" sm={6} xs={12}>
          <Track {...ADDRESS_BOOK_EVENTS.EXPORT}>
            <ButtonLink
              onClick={() => {
                setSelectedEntry(initialEntryState)
                setExportEntriesModalOpen(true)
              }}
              color="primary"
              iconType="exportImg"
              iconSize="sm"
              textSize="xl"
            >
              Export
            </ButtonLink>
          </Track>
          <Track {...ADDRESS_BOOK_EVENTS.IMPORT}>
            <ButtonLink
              onClick={() => {
                setImportEntryModalOpen(true)
              }}
              color="primary"
              iconType="importImg"
              iconSize="sm"
              textSize="xl"
            >
              Import
            </ButtonLink>
          </Track>
          <Track {...ADDRESS_BOOK_EVENTS.CREATE_ENTRY}>
            <ButtonLink
              onClick={() => {
                setSelectedEntry(initialEntryState)
                setEditCreateEntryModalOpen(true)
              }}
              color="primary"
              iconType="add"
              iconSize="sm"
              textSize="xl"
            >
              Create entry
            </ButtonLink>
          </Track>
        </Col>
      </Menu>
      <Block className={classes.formContainer}>
        <TableContainer>
          <Table
            columns={columns}
            data={addressBook}
            defaultFixed
            defaultOrderBy={AB_NAME_ID}
            defaultRowsPerPage={25}
            disableLoadingOnEmptyTable
            label="Address Book"
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
                              <PrefixedEthHashInfo
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
                        <Track {...ADDRESS_BOOK_EVENTS.EDIT_ENTRY}>
                          <ButtonHelper
                            onClick={() => {
                              setSelectedEntry({
                                entry: row,
                                isOwnerAddress: userOwner,
                              })
                              setEditCreateEntryModalOpen(true)
                            }}
                          >
                            <Icon
                              size="sm"
                              type="edit"
                              tooltip="Edit entry"
                              className={granted ? classes.editEntryButton : classes.editEntryButtonNonOwner}
                            />
                          </ButtonHelper>
                        </Track>
                        <Track {...ADDRESS_BOOK_EVENTS.DELETE_ENTRY}>
                          <ButtonHelper
                            onClick={() => {
                              setSelectedEntry({ entry: row })
                              setDeleteEntryModalOpen(true)
                            }}
                          >
                            <Icon
                              size="sm"
                              type="delete"
                              color="error"
                              tooltip="Delete entry"
                              className={granted ? classes.removeEntryButton : classes.removeEntryButtonNonOwner}
                            />
                          </ButtonHelper>
                        </Track>
                        {granted && (
                          <Track {...ADDRESS_BOOK_EVENTS.SEND}>
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
                          </Track>
                        )}
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
      <ExportEntriesModal isOpen={exportEntriesModalOpen} onClose={() => setExportEntriesModalOpen(false)} />
      <ImportEntriesModal
        importEntryModalHandler={importEntryModalHandler}
        isOpen={importEntryModalOpen}
        onClose={() => setImportEntryModalOpen(false)}
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
