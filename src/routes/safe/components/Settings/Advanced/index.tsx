import { Button, Loader, Text, Title, theme } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { generateColumns, MODULES_TABLE_ADDRESS_ID, getModuleData } from './dataFetcher'
import { styles } from './style'

import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Table from 'src/components/Table'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { grantedSelector } from 'src/routes/safe/container/selector'
import createTransaction from 'src/routes/safe/store/actions/createTransaction'
import {
  safeParamAddressFromStateSelector,
  safeNonceSelector,
  safeModulesSelector,
} from 'src/routes/safe/store/selectors'
import styled from 'styled-components'
import Modal from 'src/components/Modal'
import Paragraph from 'src/components/layout/Paragraph'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import Hairline from 'src/components/layout/Hairline'
import Col from 'src/components/layout/Col'
import Link from 'src/components/layout/Link'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { getEtherScanLink } from 'src/logic/wallets/getWeb3'
import { md, secondary } from 'src/theme/variables'

export const REMOVE_MODULE_BTN_TEST_ID = 'remove-module-btn'
export const MODULES_ROW_TEST_ID = 'owners-row'

const useStyles = makeStyles(styles)

const AddressText = styled(Text)`
  margin-left: 12px;
`

const InfoText = styled(Text)`
  margin-top: 16px;
`

const Bold = styled.strong`
  color: ${theme.colors.text};
`

const TableActionButton = styled(Button)`
  background-color: transparent;

  &:hover {
    background-color: transparent;
  }
`

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

const openIconStyle = {
  height: md,
  color: secondary,
}

const Advanced = (): JSX.Element => {
  const classes = useStyles()

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const nonce = useSelector(safeNonceSelector)
  const granted = useSelector(grantedSelector)
  const modules = useSelector(safeModulesSelector)
  const moduleData = modules ?? getModuleData(modules)

  const [viewRemoveModuleModal, setViewRemoveModuleModal] = React.useState(false)
  const hideRemoveModuleModal = () => setViewRemoveModuleModal(false)

  const [selectedModule, setSelectedModule] = React.useState(null)
  const triggerRemoveSelectedModule = (module: [string, string]): void => {
    setSelectedModule(module)
    setViewRemoveModuleModal(true)
  }

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  const removeSelectedModule = async (): Promise<void> => {
    try {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
      const [module, prevModule] = selectedModule
      const txData = safeInstance.contract.methods.disableModule(prevModule, module).encodeABI()

      dispatch(
        createTransaction({
          safeAddress,
          to: safeAddress,
          valueInWei: '0',
          txData,
          notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
          enqueueSnackbar,
          closeSnackbar,
        }),
      )
    } catch (e) {
      console.error(`failed to remove the module ${selectedModule}`, e.message)
    }
  }

  return (
    <>
      {/* Nonce */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Safe Nonce
        </Title>
        <InfoText size="lg">
          For security reasons, transactions made with the Safe need to be executed in order. The nonce shows you which
          transaction was executed most recently. You can find the nonce for a transaction in the transaction details.
        </InfoText>
        <InfoText color="secondaryLight" size="xl">
          Current Nonce: <Bold>{nonce}</Bold>
        </InfoText>
      </Block>

      {/* Modules */}
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Safe Modules
        </Title>
        <InfoText size="lg">
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
        </InfoText>
        {moduleData === null ? (
          <InfoText color="secondaryLight" size="xl">
            No modules enabled
          </InfoText>
        ) : moduleData.size === 0 ? (
          <Block className={classes.container}>
            <Loader size="md" />
          </Block>
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
                    {autoColumns.map((column) => {
                      const columnId = column.id
                      const rowElement = row[columnId]

                      return (
                        <>
                          <TableCell align={column.align} component="td" key={columnId}>
                            {columnId === MODULES_TABLE_ADDRESS_ID ? (
                              <Block justify="left">
                                <Identicon address={rowElement[0]} diameter={32} />
                                <AddressText size="lg">{rowElement[0]}</AddressText>
                              </Block>
                            ) : (
                              rowElement
                            )}
                          </TableCell>
                          <TableCell component="td">
                            <Row align="end" className={classes.actions}>
                              {granted && (
                                <TableActionButton
                                  size="md"
                                  iconType="delete"
                                  color="error"
                                  variant="outlined"
                                  onClick={() => triggerRemoveSelectedModule(rowElement)}
                                  data-testid={REMOVE_MODULE_BTN_TEST_ID}
                                >
                                  {null}
                                </TableActionButton>
                              )}
                            </Row>
                          </TableCell>
                        </>
                      )
                    })}
                  </TableRow>
                ))
              }
            </Table>
          </TableContainer>
        )}
      </Block>
      {viewRemoveModuleModal && (
        <Modal
          description="Remove the selected Module"
          handleClose={hideRemoveModuleModal}
          open={viewRemoveModuleModal}
          paperClassName={classes.modal}
          title="Remove Module"
        >
          <Row align="center" className={classes.modalHeading} grow>
            <Paragraph className={classes.modalManage} noMargin weight="bolder">
              Remove Module
            </Paragraph>
            <IconButton disableRipple onClick={hideRemoveModuleModal}>
              <Close className={classes.modalClose} />
            </IconButton>
          </Row>
          <Hairline />
          <Block className={classes.modalContainer}>
            <Row className={classes.modalOwner}>
              <Col align="center" xs={1}>
                <Identicon address={selectedModule[0]} diameter={32} />
              </Col>
              <Col xs={11}>
                <Block className={cn(classes.modalName, classes.modalUserName)}>
                  <Paragraph noMargin size="lg" weight="bolder">
                    {selectedModule[0]}
                  </Paragraph>
                  <Block className={classes.modalUser} justify="center">
                    <Paragraph color="disabled" noMargin size="md">
                      {selectedModule[0]}
                    </Paragraph>
                    <Link
                      className={classes.modalOpen}
                      target="_blank"
                      to={getEtherScanLink('address', selectedModule[0])}
                    >
                      <OpenInNew style={openIconStyle} />
                    </Link>
                  </Block>
                </Block>
              </Col>
            </Row>
            <Hairline />
            <Row className={classes.modalDescription}>
              <Paragraph noMargin>
                After removing this module, any feature or app that uses this module might no longer work. If this Safe
                requires more then one signature, the module removal will have to be confirmed by other owners as well.
              </Paragraph>
            </Row>
          </Block>
          <Hairline />
          <Row align="center" className={classes.modalButtonRow}>
            <FooterWrapper>
              <Button size="md" color="secondary" onClick={hideRemoveModuleModal}>
                Cancel
              </Button>
              <Button color="error" size="md" variant="contained" onClick={removeSelectedModule}>
                Remove
              </Button>
            </FooterWrapper>
          </Row>
        </Modal>
      )}
    </>
  )
}

export default Advanced
