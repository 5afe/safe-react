import React, { useState, useEffect } from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { List } from 'immutable'

import RemoveOwnerIcon from '../assets/icons/bin.svg'

import AddOwnerModal from './AddOwnerModal'
import EditOwnerModal from './EditOwnerModal'
import OwnerAddressTableCell from './OwnerAddressTableCell'
import RemoveOwnerModal from './RemoveOwnerModal'
import ReplaceOwnerModal from './ReplaceOwnerModal'
import RenameOwnerIcon from './assets/icons/rename-owner.svg'
import ReplaceOwnerIcon from './assets/icons/replace-owner.svg'
import { OWNERS_TABLE_ADDRESS_ID, OWNERS_TABLE_NAME_ID, generateColumns, getOwnerData } from './dataFetcher'
import { styles } from './style'

import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph/index'
import Row from 'src/components/layout/Row'
import { getOwnersWithNameFromAddressBook } from 'src/logic/addressBook/utils'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { SafeOwner } from 'src/logic/safe/store/models/safe'

export const RENAME_OWNER_BTN_TEST_ID = 'rename-owner-btn'
export const REMOVE_OWNER_BTN_TEST_ID = 'remove-owner-btn'
export const ADD_OWNER_BTN_TEST_ID = 'add-owner-btn'
export const REPLACE_OWNER_BTN_TEST_ID = 'replace-owner-btn'
export const OWNERS_ROW_TEST_ID = 'owners-row'

const useStyles = makeStyles(styles)

type Props = {
  addressBook: AddressBookState
  granted: boolean
  owners: List<SafeOwner>
}

const ManageOwners = ({ addressBook, granted, owners }: Props): React.ReactElement => {
  const { trackEvent } = useAnalytics()
  const classes = useStyles()

  const [selectedOwnerAddress, setSelectedOwnerAddress] = useState('')
  const [selectedOwnerName, setSelectedOwnerName] = useState('')
  const [modalsStatus, setModalStatus] = useState({
    showAddOwner: false,
    showRemoveOwner: false,
    showReplaceOwner: false,
    showEditOwner: false,
  })

  const onShow = (action, row?: any) => () => {
    setModalStatus((prevState) => ({
      ...prevState,
      [`show${action}`]: !prevState[`show${action}`],
    }))
    setSelectedOwnerAddress(row && row.address)
    setSelectedOwnerName(row && row.name)
  }

  const onHide = (action) => () => {
    setModalStatus((prevState) => ({
      ...prevState,
      [`show${action}`]: !Boolean(prevState[`show${action}`]),
    }))
    setSelectedOwnerAddress('')
    setSelectedOwnerName('')
  }

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Settings', label: 'Owners' })
  }, [trackEvent])

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
          Add, remove and replace owners or rename existing owners. Owner names are only stored locally and never shared
          with Gnosis or any third parties.
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
            {(sortedData) =>
              sortedData.map((row, index) => (
                <TableRow
                  className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
                  data-testid={OWNERS_ROW_TEST_ID}
                  key={index}
                >
                  {autoColumns.map((column: any) => (
                    <TableCell align={column.align} component="td" key={column.id} style={cellWidth(column.width)}>
                      {column.id === OWNERS_TABLE_ADDRESS_ID ? (
                        <OwnerAddressTableCell address={row[column.id]} showLinks />
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
                        onClick={onShow('EditOwner', row)}
                        src={RenameOwnerIcon}
                        testId={RENAME_OWNER_BTN_TEST_ID}
                      />
                      {granted && (
                        <>
                          <Img
                            alt="Replace owner"
                            className={classes.replaceOwnerIcon}
                            onClick={onShow('ReplaceOwner', row)}
                            src={ReplaceOwnerIcon}
                            testId={REPLACE_OWNER_BTN_TEST_ID}
                          />
                          {ownerData.size > 1 && (
                            <Img
                              alt="Remove owner"
                              className={classes.removeOwnerIcon}
                              onClick={onShow('RemoveOwner', row)}
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
                onClick={onShow('AddOwner')}
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
      <AddOwnerModal isOpen={modalsStatus.showAddOwner} onClose={onHide('AddOwner')} />
      <RemoveOwnerModal
        isOpen={modalsStatus.showRemoveOwner}
        onClose={onHide('RemoveOwner')}
        ownerAddress={selectedOwnerAddress}
        ownerName={selectedOwnerName}
      />
      <ReplaceOwnerModal
        isOpen={modalsStatus.showReplaceOwner}
        onClose={onHide('ReplaceOwner')}
        ownerAddress={selectedOwnerAddress}
        ownerName={selectedOwnerName}
      />
      <EditOwnerModal
        isOpen={modalsStatus.showEditOwner}
        onClose={onHide('EditOwner')}
        ownerAddress={selectedOwnerAddress}
        selectedOwnerName={selectedOwnerName}
      />
    </>
  )
}

export default ManageOwners
