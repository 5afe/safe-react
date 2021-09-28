import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import * as React from 'react'

interface CellWidth {
  maxWidth: string
}

export const cellWidth = (width?: string | number): CellWidth | undefined => {
  if (!width) {
    return undefined
  }

  return {
    maxWidth: `${width}px`,
  }
}

class GnoTableHead extends React.PureComponent<any> {
  changeSort = (property, orderAttr) => () => {
    const { onSort } = this.props

    onSort(property, orderAttr)
  }

  render() {
    const { columns, order, orderBy } = this.props

    return (
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              align={column.align}
              key={column.id}
              padding={column.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === column.id ? order : false}
            >
              {column.static ? (
                <div style={column.style}>{column.label}</div>
              ) : (
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.changeSort(column.id, column.order)}
                  style={column.style}
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
