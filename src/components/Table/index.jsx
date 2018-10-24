// @flow
import * as React from 'react'
import { List } from 'immutable'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
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
  children: Function,
  size: number,
  defaultFixed?: boolean,
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
    boxShadow: '0 -1px 4px 0 rgba(74, 85, 121, 0.5)',
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
    boxShadow: '0 2px 4px 0 rgba(74, 85, 121, 0.5)',
  },
}

class GnoTable<K> extends React.Component<Props<K>, State> {
  state = {
    page: 0,
    order: 'asc',
    orderBy: this.props.defaultOrderBy,
    fixed: !!this.props.defaultFixed,
    orderProp: false,
    rowsPerPage: 5,
  }

  onSort = (property: string, orderProp: boolean) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState(() => ({
      order, orderBy, orderProp, fixed: false,
    }))
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
      data, label, columns, classes, children, size,
    } = this.props

    const {
      order, orderBy, page, orderProp, rowsPerPage, fixed,
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

    const sortedData = stableSort(data, getSorting(order, orderBy, orderProp), fixed)
      .slice(page * rowsPerPage, ((page * rowsPerPage) + rowsPerPage))

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
            { children(sortedData) }
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={size}
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
