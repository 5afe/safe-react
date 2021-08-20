import { Icon, EthHashInfo } from '@gnosis.pm/safe-react-components'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import React from 'react'

import { generateColumns } from './dataFetcher'
import { RemoveModuleModal } from './RemoveModuleModal'
import { useStyles } from './style'

import ButtonHelper from 'src/components/ButtonHelper'
import Table from 'src/components/Table'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import { getExplorerInfo } from 'src/config'

const REMOVE_MODULE_BTN_TEST_ID = 'remove-module-btn'
const MODULES_ROW_TEST_ID = 'owners-row'

interface TransactionGuardProps {
  address: string
}

export const TransactionGuard = ({ address }: TransactionGuardProps): React.ReactElement => {
  const classes = useStyles()

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const [viewRemoveModuleModal, setViewRemoveModuleModal] = React.useState(false)
  const hideRemoveModuleModal = () => setViewRemoveModuleModal(false)

  const triggerRemoveSelectedModule = (): void => {
    setViewRemoveModuleModal(true)
  }

  return (
    <>
      <TableContainer>
        <Table columns={columns} data={[address]} defaultFixed disablePagination label="Modules" noBorder>
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
                  return (
                    <React.Fragment key={`${columnId}-${index}`}>
                      <TableCell align={column.align} component="td" key={columnId}>
                        <Block justify="left">
                          <EthHashInfo hash={row} showCopyBtn showAvatar explorerUrl={getExplorerInfo(row)} />
                        </Block>
                      </TableCell>
                      <TableCell component="td">
                        <Row align="end" className={classes.actions}>
                          <ButtonHelper
                            onClick={() => triggerRemoveSelectedModule()}
                            data-testid={REMOVE_MODULE_BTN_TEST_ID}
                          >
                            <Icon size="sm" type="delete" color="error" tooltip="Remove module" />
                          </ButtonHelper>
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
      {viewRemoveModuleModal && address && (
        <RemoveModuleModal onClose={hideRemoveModuleModal} selectedModulePair={[address, address]} />
      )}
    </>
  )
}
