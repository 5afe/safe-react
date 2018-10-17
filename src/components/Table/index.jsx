// @flow
import * as React from 'react'
import { List } from 'immutable'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableHead, { type Column } from '~/components/Table/TableHead'
import { type Order, stableSort, getSorting } from '~/components/Table/sorting'

type Props<K> = {
  label: string,
  rowsPerPage?: number,
  defaultOrderBy: string,
  columns: List<Column>,
  data: Array<K>,
}

type State = {
  page: number,
  order: Order,
  orderBy: string,
}

class GnoTable<K> extends React.Component<Props<K>, State> {
  state = {
    page: 0,
    order: 'desc',
    orderBy: this.props.defaultOrderBy,
  }

  onSort = (property: string) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  render() {
    const {
      data, label, columns, rowsPerPage = 5,
    } = this.props
    const { order, orderBy, page } = this.state

    return (
      <Table aria-labelledby={label}>
        <TableHead
          columns={columns}
          order={order}
          orderBy={orderBy}
          onSort={this.onSort}
        />
        <TableBody>
          {stableSort(data, getSorting(order, orderBy))
            .slice(page * rowsPerPage, ((page * rowsPerPage) + rowsPerPage))
            .map((row: any) => (
              <TableRow
                tabIndex={-1}
                key={row.id}
              >
                {
                  columns.map((column: Column) => (
                    <TableCell key={column.id} numeric={column.numeric} component="th" scope="row" padding="none">
                      {row[column.id]}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))}
        </TableBody>
      </Table>
    )
  }
}

export default GnoTable
