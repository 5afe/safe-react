import { Set } from 'immutable'
import { makeStyles } from '@material-ui/core/styles'
// import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import { /*useDispatch, */ useSelector } from 'react-redux'
import cn from 'classnames'

// import ChangeThreshold from './ChangeThreshold'
import { styles } from './style'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
// import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'
// import Row from 'src/components/layout/Row'
// import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
// import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
// import { grantedSelector } from 'src/routes/safe/container/selector'
// import createTransaction from 'src/routes/safe/store/actions/createTransaction'
import {
  // safeOwnersSelector,
  // safeParamAddressFromStateSelector,
  // safeThresholdSelector,
  safeNonceSelector,
  safeModulesSelector,
} from 'src/routes/safe/store/selectors'
import DividerLine from 'src/components/DividerLine'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '../../../../../components/Table'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { cellWidth } from '../../../../../components/Table/TableHead'
import OwnerAddressTableCell from '../ManageOwners/OwnerAddressTableCell'
import Row from '../../../../../components/layout/Row'
import Img from '../../../../../components/layout/Img'
// import RenameOwnerIcon from '../ManageOwners/assets/icons/rename-owner.svg'
// import ReplaceOwnerIcon from '../ManageOwners/assets/icons/replace-owner.svg'
import RemoveOwnerIcon from '../assets/icons/bin.svg'
import { generateColumns, MODULES_TABLE_ADDRESS_ID, getModuleData } from './dataFetcher'
import { grantedSelector } from '../../../container/selector'
// import RemoveOwnerModal from '../ManageOwners/RemoveOwnerModal'
// import { getOwnersWithNameFromAddressBook } from '../../../../../logic/addressBook/utils'
// import { getOwnerData } from '../ManageOwners/dataFetcher'

export const REMOVE_MODULE_BTN_TEST_ID = 'remove-module-btn'
export const MODULES_ROW_TEST_ID = 'owners-row'

const useStyles = makeStyles(styles)

const useToggle = (initialOn = false) => {
  const [on, setOn] = useState(initialOn)
  const toggle = () => setOn(!on)

  return { on, toggle }
}

const Advanced: React.FC = () => {
  const classes = useStyles()
  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  // const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  // const dispatch = useDispatch()

  const { on, toggle } = useToggle()

  const nonce = useSelector(safeNonceSelector)
  const granted = useSelector(grantedSelector)
  const modules = useSelector(safeModulesSelector)
  console.log(modules)
  const moduleData = getModuleData(Set(modules))
  // const ownersAdbk = getOwnersWithNameFromAddressBook(addressBook, owners)
  // const ownerData = getOwnerData(ownersAdbk)

  // const safeAddress = useSelector(safeParamAddressFromStateSelector)
  // const owners = useSelector(safeOwnersSelector)

  // const onChangeThreshold = async (newThreshold) => {
  //   const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  //   const txData = safeInstance.contract.methods.changeThreshold(newThreshold).encodeABI()
  //
  //   dispatch(
  //     createTransaction({
  //       safeAddress,
  //       to: safeAddress,
  //       valueInWei: 0,
  //       txData,
  //       notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
  //       enqueueSnackbar,
  //       closeSnackbar,
  //     } as any),
  //   )
  // }

  return (
    <>
      <Block className={classes.container}>
        <Heading tag="h2">Safe Nonce</Heading>
        <Paragraph>
          For security reasons, transactions made with the Safe need to be executed in order. The nonce shows you which
          transaction was executed most recently. You can find the nonce for a transaction in the transaction details.
        </Paragraph>
        <Paragraph className={classes.ownersText} size="lg">
          Current Nonce: <Bold>{nonce}</Bold>
        </Paragraph>
      </Block>
      <DividerLine withArrow={false} />
      <Block className={classes.container}>
        <Heading tag="h2">Safe Modules</Heading>
        <Paragraph>
          Modules allow you to customize the access-control logic of your Safe. Modules are potentially risky, so make
          sure to only use modules from trusted sources. Learn more about modules{' '}
          <a
            href="https://docs.gnosis.io/safe/docs/contracts_architecture/#3-module-management"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </a>
          .
        </Paragraph>
        {moduleData.size === 0 ? (
          <Paragraph className={classes.ownersText} size="lg">
            No modules enabled
          </Paragraph>
        ) : (
          <TableContainer>
            <Table
              columns={columns}
              data={moduleData}
              defaultFixed
              defaultOrderBy={MODULES_TABLE_ADDRESS_ID}
              disablePagination
              label="Modules"
              noBorder
              size={moduleData.size}
            >
              {(sortedData) =>
                sortedData.map((row, index) => (
                  <TableRow
                    className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
                    data-testid={MODULES_ROW_TEST_ID}
                    key={index}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column: any) => (
                      <TableCell align={column.align} component="td" key={column.id} style={cellWidth(column.width)}>
                        {column.id === MODULES_TABLE_ADDRESS_ID ? (
                          <OwnerAddressTableCell address={row[column.id]} showLinks />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                    <TableCell component="td">
                      <Row align="end" className={classes.actions}>
                        {granted && (
                          <Img
                            alt="Remove module"
                            className={classes.removeModuleIcon}
                            onClick={toggle}
                            src={RemoveOwnerIcon}
                            testId={REMOVE_MODULE_BTN_TEST_ID}
                          />
                        )}
                      </Row>
                    </TableCell>
                  </TableRow>
                ))
              }
            </Table>
          </TableContainer>
        )}
      </Block>
      {/*<RemoveModuleModal*/}
      {/*  isOpen={showRemoveModal}*/}
      {/*  onClose={onHide('RemoveModal')}*/}
      {/*  ownerAddress={selectedModalAddress}*/}
      {/*  ownerName={selectedModalName}*/}
      {/*/>*/}
      <Modal description="Disable Module" handleClose={toggle} open={on} title="Disable Module">
        {/*<ChangeThreshold*/}
        {/*  onChangeThreshold={onChangeThreshold}*/}
        {/*  onClose={toggle}*/}
        {/*  owners={owners}*/}
        {/*  safeAddress={safeAddress}*/}
        {/*  threshold={threshold}*/}
        {/*/>*/}
      </Modal>
    </>
  )
}

export default Advanced
