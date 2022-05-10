import { Icon } from '@gnosis.pm/safe-react-components'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'

import { generateColumns } from './dataFetcher'
import { RemoveGuardModal } from './RemoveGuardModal'
import { useStyles } from './style'

import ButtonHelper from 'src/components/ButtonHelper'
import { grantedSelector } from 'src/routes/safe/container/selector'
import Table from 'src/components/Table'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'

export const REMOVE_GUARD_BTN_TEST_ID = 'remove-guard-btn'
export const GUARDS_ROW_TEST_ID = 'guards-row'

interface TransactionGuardProps {
  address: string
}

export const TransactionGuard = ({ address }: TransactionGuardProps): React.ReactElement => {
  const classes = useStyles()

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const granted = useSelector(grantedSelector)

  const [viewRemoveGuardModal, setViewRemoveGuardModal] = useState(false)
  const hideRemoveGuardModal = () => setViewRemoveGuardModal(false)

  const triggerRemoveSelectedGuard = (): void => {
    setViewRemoveGuardModal(true)
  }

  return (
    <>
      <TableContainer>
        <Table columns={columns} data={[address]} defaultFixed disablePagination label="Modules" noBorder>
          {(sortedData) =>
            sortedData.map((row, index) => (
              <TableRow
                className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
                data-testid={GUARDS_ROW_TEST_ID}
                key={index}
                tabIndex={-1}
              >
                {autoColumns.map((column, index) => {
                  const columnId = column.id
                  return (
                    <Fragment key={`${columnId}-${index}`}>
                      <TableCell align={column.align} component="td" key={columnId}>
                        <Block justify="left">
                          <PrefixedEthHashInfo hash={row} showCopyBtn showAvatar explorerUrl={getExplorerInfo(row)} />
                        </Block>
                      </TableCell>
                      <TableCell component="td">
                        <Row align="end" className={classes.actions}>
                          {granted && (
                            <ButtonHelper
                              onClick={triggerRemoveSelectedGuard}
                              dataTestId={`${row}-${REMOVE_GUARD_BTN_TEST_ID}`}
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
      {viewRemoveGuardModal && address && <RemoveGuardModal onClose={hideRemoveGuardModal} guardAddress={address} />}
    </>
  )
}
