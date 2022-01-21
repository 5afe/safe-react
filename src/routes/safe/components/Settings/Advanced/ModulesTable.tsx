import { Icon } from '@gnosis.pm/safe-react-components'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'

import { generateColumns, ModuleAddressColumn, MODULES_TABLE_ADDRESS_ID } from './dataFetcher'
import { RemoveModuleModal } from './RemoveModuleModal'
import { useStyles } from './style'
import ButtonHelper from 'src/components/ButtonHelper'
import { grantedSelector } from 'src/routes/safe/container/selector'
import Table from 'src/components/Table'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'

const REMOVE_MODULE_BTN_TEST_ID = 'remove-module-btn'
const MODULES_ROW_TEST_ID = 'owners-row'

interface ModulesTableProps {
  moduleData: ModuleAddressColumn | null
}

export const ModulesTable = ({ moduleData }: ModulesTableProps): React.ReactElement => {
  const classes = useStyles()

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const granted = useSelector(grantedSelector)

  const [viewRemoveModuleModal, setViewRemoveModuleModal] = useState(false)
  const hideRemoveModuleModal = () => setViewRemoveModuleModal(false)

  const [selectedModuleAddress, setSelectedModuleAddress] = useState<string>()
  const triggerRemoveSelectedModule = (moduleAddress: string): void => {
    setSelectedModuleAddress(moduleAddress)
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
                  const [, moduleAddress] = rowElement

                  return (
                    <Fragment key={`${columnId}-${index}`}>
                      <TableCell align={column.align} component="td" key={columnId}>
                        {columnId === MODULES_TABLE_ADDRESS_ID ? (
                          <Block justify="left">
                            <PrefixedEthHashInfo
                              hash={moduleAddress}
                              showCopyBtn
                              showAvatar
                              explorerUrl={getExplorerInfo(moduleAddress)}
                            />
                          </Block>
                        ) : (
                          rowElement
                        )}
                      </TableCell>
                      <TableCell component="td">
                        <Row align="end" className={classes.actions}>
                          {granted && (
                            <ButtonHelper
                              onClick={() => triggerRemoveSelectedModule(moduleAddress)}
                              dataTestId={`${moduleAddress}-${REMOVE_MODULE_BTN_TEST_ID}`}
                            >
                              <Icon size="sm" type="delete" color="error" tooltip="Remove module" />
                            </ButtonHelper>
                          )}
                        </Row>
                      </TableCell>
                    </Fragment>
                  )
                })}
              </TableRow>
            ))
          }
        </Table>
      </TableContainer>
      {viewRemoveModuleModal && selectedModuleAddress && (
        <RemoveModuleModal onClose={hideRemoveModuleModal} selectedModuleAddress={selectedModuleAddress} />
      )}
    </>
  )
}
