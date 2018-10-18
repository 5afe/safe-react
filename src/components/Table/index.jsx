// @flow
import * as React from 'react'
import { List } from 'immutable'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'
import { type Order, stableSort, getSorting } from '~/components/Table/sorting'
import TableHead, { type Column } from '~/components/Table/TableHead'

type Props<K> = {
  label: string,
  defaultOrderBy: string,
  columns: List<Column>,
  data: Array<K>,
  classes: Object,
}

type State = {
  page: number,
  order: Order,
  orderBy: string,
  orderProp: boolean,
  rowsPerPage: number,
}

const styles = {
  root: {
    backgroundColor: 'white',
    boxShadow: '0 -1px 5px 0 rgba(74, 85, 121, 0.5)',
  },
  selectRoot: {
    lineHeight: '40px',
    backgroundColor: 'white',
  },
  white: {
    backgroundColor: 'white',
  },
  paginationRoot: {
    backgroundColor: 'white',
    boxShadow: '0 2px 5px 0 rgba(74, 85, 121, 0.5)',
  },
}

class GnoTable<K> extends React.Component<Props<K>, State> {
  state = {
    page: 0,
    order: 'desc',
    orderBy: this.props.defaultOrderBy,
    orderProp: false,
    rowsPerPage: 5,
  }

  onSort = (property: string, orderProp: boolean) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy, orderProp })
  }

  handleChangePage = (page: number) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const rowsPerPage = Number(event.target.value)
    this.setState({ rowsPerPage })
  }

  render() {
    const {
      data, label, columns, classes,
    } = this.props

    const {
      order, orderBy, page, orderProp, rowsPerPage,
    } = this.state

    const backProps = {
      'aria-label': 'Previous Page',
    }

    const nextProps = {
      'aria-label': 'Next Page',
    }

    const paginationClasses = {
      selectRoot: classes.selectRoot,
      root: classes.paginationRoot,
      input: classes.white,
    }

    return (
      <React.Fragment>
        <Table aria-labelledby={label} className={classes.root}>
          <TableHead
            columns={columns}
            order={order}
            orderBy={orderBy}
            onSort={this.onSort}
          />
          <TableBody>
            {stableSort(data, getSorting(order, orderBy, orderProp))
              .slice(page * rowsPerPage, ((page * rowsPerPage) + rowsPerPage))
              .map((row: any, index: number) => (
                <TableRow
                  tabIndex={-1}
                  key={index}
                >
                  {
                    columns.map((column: Column) => (
                      <TableCell key={column.id} numeric={column.numeric} component="th" scope="row">
                        {row[column.id]}
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={backProps}
          nextIconButtonProps={nextProps}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          classes={paginationClasses}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(GnoTable)
