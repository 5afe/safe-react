import { Button, Text } from '@gnosis.pm/safe-react-components'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import React, { ReactElement, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Row from 'src/components/layout/Row'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Table from 'src/components/Table'
import { AddressInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import { RemoveLimitModal } from 'src/routes/safe/components/Settings/SpendingLimit/RemoveLimitModal'
import { useStyles } from 'src/routes/safe/components/Settings/SpendingLimit/style'
import { grantedSelector } from 'src/routes/safe/container/selector'

import {
  generateColumns,
  SPENDING_LIMIT_TABLE_BENEFICIARY_ID,
  SPENDING_LIMIT_TABLE_RESET_TIME_ID,
  SPENDING_LIMIT_TABLE_SPENT_ID,
  SpendingLimitTable,
} from './dataFetcher'
import { SpentVsAmount } from './SpentVsAmount'

const TableActionButton = styled(Button)`
  background-color: transparent;
  padding: 0;

  &:hover {
    background-color: transparent;
  }
`

interface SpendingLimitTableProps {
  data?: SpendingLimitTable[]
}

export const LimitsTable = ({ data }: SpendingLimitTableProps): ReactElement => {
  const classes = useStyles()
  const granted = useSelector(grantedSelector)

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const [selectedRow, setSelectedRow] = useState<SpendingLimitTable>()

  return (
    <>
      <TableContainer style={{ minHeight: '420px' }}>
        <Table
          columns={columns}
          data={data}
          defaultFixed
          defaultOrderBy={SPENDING_LIMIT_TABLE_BENEFICIARY_ID}
          defaultRowsPerPage={5}
          label="Spending limits"
          noBorder
          size={data?.length}
        >
          {(sortedData) =>
            sortedData.map((row, index) => (
              <TableRow
                className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
                data-testid="spending-limit-table-row"
                key={index}
                tabIndex={-1}
              >
                {autoColumns.map((column, index) => {
                  const columnId = column.id
                  const rowElement = row[columnId]

                  return (
                    <TableCell align={column.align} component="td" key={`${columnId}-${index}`}>
                      {columnId === SPENDING_LIMIT_TABLE_BENEFICIARY_ID && <AddressInfo address={rowElement} />}
                      {columnId === SPENDING_LIMIT_TABLE_SPENT_ID && <SpentVsAmount {...rowElement} />}
                      {columnId === SPENDING_LIMIT_TABLE_RESET_TIME_ID && (
                        <Text size="lg">{rowElement.relativeTime}</Text>
                      )}
                    </TableCell>
                  )
                })}
                <TableCell component="td">
                  <Row align="end" className={classes.actions}>
                    {granted && (
                      <TableActionButton
                        size="md"
                        iconType="delete"
                        color="error"
                        variant="outlined"
                        onClick={() => setSelectedRow(row)}
                        data-testid="remove-action"
                      >
                        {null}
                      </TableActionButton>
                    )}
                  </Row>
                </TableCell>
              </TableRow>
            ))
          }
        </Table>
      </TableContainer>
      {selectedRow && (
        <RemoveLimitModal onClose={() => setSelectedRow(undefined)} spendingLimit={selectedRow} open={true} />
      )}
    </>
  )
}
