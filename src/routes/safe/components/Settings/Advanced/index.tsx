import { Button, GenericModal, Text, Title, theme } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import { Set } from 'immutable'
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

const Advanced: React.FC = () => {
  const classes = useStyles()

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const nonce = useSelector(safeNonceSelector)
  const granted = useSelector(grantedSelector)
  const modules = useSelector(safeModulesSelector)
  const moduleData = getModuleData(Set(modules))

  const [viewRemoveModuleModal, setViewRemoveModuleModal] = React.useState(false)
  const hideRemoveModuleModal = () => setViewRemoveModuleModal(false)

  const [selectedModule, setSelectedModule] = React.useState(null)
  const triggerRemoveSelectedModule = (moduleAddress: string): void => {
    setSelectedModule(moduleAddress)
    setViewRemoveModuleModal(true)
  }

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  const removeSelectedModule = async (): Promise<void> => {
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    const txData = safeInstance.contract.methods.disableModule(selectedModule).encodeABI()

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
        {moduleData.size === 0 ? (
          <InfoText color="secondaryLight" size="xl">
            No modules enabled
          </InfoText>
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
                                <Identicon address={rowElement} diameter={32} />
                                <AddressText size="lg">{rowElement}</AddressText>
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
                                  onClick={() => triggerRemoveSelectedModule(columnId)}
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
        <GenericModal
          onClose={hideRemoveModuleModal}
          title="Disable Module"
          body={<div>This is the body</div>}
          footer={
            <FooterWrapper>
              <Button size="md" color="secondary" onClick={hideRemoveModuleModal}>
                Cancel
              </Button>
              <Button color="error" size="md" variant="contained" onClick={removeSelectedModule}>
                Remove
              </Button>
            </FooterWrapper>
          }
        />
      )}
    </>
  )
}

export default Advanced
