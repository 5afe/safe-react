import { useState, ReactElement } from 'react'
import { Icon } from '@gnosis.pm/safe-react-components'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import cn from 'classnames'

import { AddOwnerModal } from './AddOwnerModal'
import { EditOwnerModal } from './EditOwnerModal'
import { RemoveOwnerModal } from './RemoveOwnerModal'
import { ReplaceOwnerModal } from './ReplaceOwnerModal'
import { OWNERS_TABLE_ADDRESS_ID, generateColumns, getOwnerData, OwnerData } from './dataFetcher'
import { useStyles } from './style'

import { getExplorerInfo } from 'src/config'
import ButtonHelper from 'src/components/ButtonHelper'
import Table from 'src/components/Table'
import { cellWidth } from 'src/components/Table/TableHead'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph/index'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import Track from 'src/components/Track'
import { SETTINGS_EVENTS } from 'src/utils/events/settings'

export const RENAME_OWNER_BTN_TEST_ID = 'rename-owner-btn'
export const REMOVE_OWNER_BTN_TEST_ID = 'remove-owner-btn'
export const ADD_OWNER_BTN_TEST_ID = 'add-owner-btn'
export const REPLACE_OWNER_BTN_TEST_ID = 'replace-owner-btn'
export const OWNERS_ROW_TEST_ID = 'owners-row'

type Props = {
  granted: boolean
  owners: AddressBookState
}

const ManageOwners = ({ granted, owners }: Props): ReactElement => {
  const classes = useStyles()

  const [selectedOwner, setSelectedOwner] = useState<OwnerData | undefined>()
  const [modalsStatus, setModalStatus] = useState({
    showAddOwner: false,
    showRemoveOwner: false,
    showReplaceOwner: false,
    showEditOwner: false,
  })

  const onShow = (action, row?: OwnerData) => () => {
    setModalStatus((prevState) => ({
      ...prevState,
      [`show${action}`]: !prevState[`show${action}`],
    }))
    if (row) {
      setSelectedOwner(row)
    }
  }

  const onHide = (action) => () => {
    setModalStatus((prevState) => ({
      ...prevState,
      [`show${action}`]: !Boolean(prevState[`show${action}`]),
    }))
    setSelectedOwner(undefined)
  }

  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const ownerData = getOwnerData(owners)

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
            defaultOrderBy={OWNERS_TABLE_ADDRESS_ID}
            disablePagination
            label="Owners"
            noBorder
            size={ownerData.length}
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
                  ))}
                  <TableCell component="td">
                    <Row align="end" className={classes.actions}>
                      <Track {...SETTINGS_EVENTS.OWNERS.EDIT_OWNER}>
                        <ButtonHelper onClick={onShow('EditOwner', row)} dataTestId={RENAME_OWNER_BTN_TEST_ID}>
                          <Icon size="sm" type="edit" color="icon" tooltip="Edit owner" />
                        </ButtonHelper>
                      </Track>
                      {granted && (
                        <>
                          <Track {...SETTINGS_EVENTS.OWNERS.REPLACE_OWNER}>
                            <ButtonHelper onClick={onShow('ReplaceOwner', row)} dataTestId={REPLACE_OWNER_BTN_TEST_ID}>
                              <Icon size="sm" type="replaceOwner" color="icon" tooltip="Replace owner" />
                            </ButtonHelper>
                          </Track>
                          {ownerData.length > 1 && (
                            <Track {...SETTINGS_EVENTS.OWNERS.REMOVE_OWNER}>
                              <ButtonHelper onClick={onShow('RemoveOwner', row)} dataTestId={REMOVE_OWNER_BTN_TEST_ID}>
                                <Icon size="sm" type="delete" color="error" tooltip="Remove owner" />
                              </ButtonHelper>
                            </Track>
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
              <Track {...SETTINGS_EVENTS.OWNERS.ADD_OWNER}>
                <Button
                  color="primary"
                  onClick={onShow('AddOwner')}
                  size="small"
                  testId={ADD_OWNER_BTN_TEST_ID}
                  variant="contained"
                >
                  Add new owner
                </Button>
              </Track>
            </Col>
          </Row>
        </>
      )}
      <AddOwnerModal isOpen={modalsStatus.showAddOwner} onClose={onHide('AddOwner')} />
      {selectedOwner && (
        <>
          <RemoveOwnerModal
            isOpen={modalsStatus.showRemoveOwner}
            onClose={onHide('RemoveOwner')}
            owner={selectedOwner}
          />
          <ReplaceOwnerModal
            isOpen={modalsStatus.showReplaceOwner}
            onClose={onHide('ReplaceOwner')}
            owner={selectedOwner}
          />
          <EditOwnerModal isOpen={modalsStatus.showEditOwner} onClose={onHide('EditOwner')} owner={selectedOwner} />
        </>
      )}
    </>
  )
}

export default ManageOwners
