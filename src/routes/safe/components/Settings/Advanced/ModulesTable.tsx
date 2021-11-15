import { Icon, EthHashInfo } from '@gnosis.pm/safe-react-components'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import { useState, Fragment } from 'react'

import { useSelector } from 'react-redux'

import { generateColumns, ModuleAddressColumn, MODULES_TABLE_ADDRESS_ID } from './dataFetcher'
import { RemoveModuleModal } from './RemoveModuleModal'
import { useStyles } from './style'

import ButtonHelper from 'src/components/ButtonHelper'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { ModulePair } from 'src/logic/safe/store/models/safe'
import Table from 'src/components/Table'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import { TableColumn } from 'src/components/Table/types'
import { currentBlockExplorerInfo } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'

const REMOVE_MODULE_BTN_TEST_ID = 'remove-module-btn'
const MODULES_ROW_TEST_ID = 'owners-row'

interface ModulesTableProps {
  moduleData: ModuleAddressColumn | null
}

export const ModulesTable = ({ moduleData }: ModulesTableProps): React.ReactElement => {
  const classes = useStyles()

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const [viewRemoveModuleModal, setViewRemoveModuleModal] = useState(false)
  const hideRemoveModuleModal = () => setViewRemoveModuleModal(false)

  const [selectedModulePair, setSelectedModulePair] = useState<ModulePair>()

  const triggerRemoveSelectedModule = (modulePair: ModulePair): void => {
    setSelectedModulePair(modulePair)
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
                {autoColumns.map((column, index) => (
                  <AutoColumn
                    key={`${column.id}-${index}`}
                    column={column}
                    rowElement={row[column.id]}
                    triggerRemoveSelectedModule={triggerRemoveSelectedModule}
                  />
                ))}
              </TableRow>
            ))
          }
        </Table>
      </TableContainer>
      {viewRemoveModuleModal && selectedModulePair && (
        <RemoveModuleModal onClose={hideRemoveModuleModal} selectedModulePair={selectedModulePair} />
      )}
    </>
  )
}

const AutoColumn = ({
  column,
  rowElement,
  triggerRemoveSelectedModule,
}: {
  column: TableColumn
  rowElement: ModulePair
  triggerRemoveSelectedModule: (modulePair: ModulePair) => void
}) => {
  const classes = useStyles()

  const granted = useSelector(grantedSelector)
  const [, moduleAddress] = rowElement
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, moduleAddress))
  return (
    <Fragment>
      <TableCell align={column.align} component="td" key={column.id}>
        {column.id === MODULES_TABLE_ADDRESS_ID ? (
          <Block justify="left">
            <EthHashInfo hash={moduleAddress} showCopyBtn showAvatar explorerUrl={explorerUrl} />
          </Block>
        ) : (
          rowElement
        )}
      </TableCell>
      <TableCell component="td">
        <Row align="end" className={classes.actions}>
          {granted && (
            <ButtonHelper
              onClick={() => triggerRemoveSelectedModule(rowElement)}
              dataTestId={`${moduleAddress}-${REMOVE_MODULE_BTN_TEST_ID}`}
            >
              <Icon size="sm" type="delete" color="error" tooltip="Remove module" />
            </ButtonHelper>
          )}
        </Row>
      </TableCell>
    </Fragment>
  )
}
