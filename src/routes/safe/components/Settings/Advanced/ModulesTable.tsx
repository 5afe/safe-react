import { Button, Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import styled from 'styled-components'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'

import { generateColumns, ModuleAddressColumn, MODULES_TABLE_ADDRESS_ID } from './dataFetcher'
import RemoveModuleModal from './RemoveModuleModal'
import { styles } from './style'

import { grantedSelector } from 'src/routes/safe/container/selector'
import { ModulePair } from 'src/logic/safe/store/models/safe'
import Table from 'src/components/Table'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Block from 'src/components/layout/Block'
import Identicon from 'src/components/Identicon'
import Row from 'src/components/layout/Row'

const REMOVE_MODULE_BTN_TEST_ID = 'remove-module-btn'
const MODULES_ROW_TEST_ID = 'owners-row'

const useStyles = makeStyles(styles)

const AddressText = styled(Text)`
  margin-left: 12px;
`

const TableActionButton = styled(Button)`
  background-color: transparent;

  &:hover {
    background-color: transparent;
  }
`

interface ModulesTableProps {
  moduleData: ModuleAddressColumn | null
}

const ModulesTable = ({ moduleData }: ModulesTableProps): React.ReactElement => {
  const classes = useStyles()

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const granted = useSelector(grantedSelector)

  const [viewRemoveModuleModal, setViewRemoveModuleModal] = React.useState(false)
  const hideRemoveModuleModal = () => setViewRemoveModuleModal(false)

  const [selectedModule, setSelectedModule] = React.useState<ModulePair>()
  const triggerRemoveSelectedModule = (module: ModulePair): void => {
    setSelectedModule(module)
    setViewRemoveModuleModal(true)
  }

  return (
    <>
      <TableContainer>
        <Table
          columns={columns}
          data={moduleData}
          defaultFixed
          defaultOrderBy={MODULES_TABLE_ADDRESS_ID}
          disablePagination
          label="Modules"
          noBorder
          size={moduleData?.length}
        >
          {(sortedData) =>
            sortedData.map((row, index) => (
              <TableRow
                className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
                data-testid={MODULES_ROW_TEST_ID}
                key={index}
                tabIndex={-1}
              >
                {autoColumns.map((column, index) => {
                  const columnId = column.id
                  const rowElement = row[columnId]

                  return (
                    <React.Fragment key={`${columnId}-${index}`}>
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
                    </React.Fragment>
                  )
                })}
              </TableRow>
            ))
          }
        </Table>
      </TableContainer>
      {viewRemoveModuleModal && selectedModule && (
        <RemoveModuleModal onClose={hideRemoveModuleModal} selectedModule={selectedModule} />
      )}
    </>
  )
}

export default ModulesTable
