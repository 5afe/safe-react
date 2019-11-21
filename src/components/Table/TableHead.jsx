// @flow
import * as React from 'react'
import { List } from 'immutable'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { type Order } from '~/components/Table/sorting'

export type Column = {
  id: string,
  align?: string,
  order: boolean, // If data for sorting will be provided in a different attr
  disablePadding: boolean,
  label: string,
  custom: boolean, // If content will be rendered by user manually
  width?: number,
  static?: boolean, // If content can't be sorted by values in the column
}

export const cellWidth = (width: number | typeof undefined) => {
  if (!width) {
    return undefined
  }

  return {
    maxWidth: `${width}px`,
  }
}

type Props = {
  columns: List<Column>,
  orderBy: string, // id of one of the described columns
  order: Order,
  onSort: (property: string, orderAttr: boolean) => void,
}

class GnoTableHead extends React.PureComponent<Props> {
  changeSort = (property: string, orderAttr: boolean) => () => {
    const { onSort } = this.props

    onSort(property, orderAttr)
  }

  render() {
    const { columns, order, orderBy } = this.props

    return (
      <TableHead>
        <TableRow>
          {columns.map((column: Column) => (
            <TableCell
              key={column.id}
              align={column.align}
              padding={column.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === column.id ? order : false}
            >
              {column.static ? (
                column.label
              ) : (
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.changeSort(column.id, column.order)}
                >
                  {column.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }
}

export default GnoTableHead
