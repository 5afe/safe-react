// @flow
import * as React from 'react'
import classNames from 'classnames'
import { List } from 'immutable'
import Row from '~/components/layout/Row'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import TablePagination from '@material-ui/core/TablePagination'
import { type Order, stableSort, getSorting } from '~/components/Table/sorting'
import TableHead, { type Column } from '~/components/Table/TableHead'
import { xl } from '~/theme/variables'

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
  orderBy?: string,
  orderProp: boolean,
  rowsPerPage: number,
  fixed?: boolean,
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
    marginBottom: xl,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
}

const FIXED_HEIGHT = 49

class GnoTable<K> extends React.Component<Props<K>, State> {
  state = {
    page: 0,
    order: 'asc',
    orderBy: undefined,
    fixed: undefined,
    orderProp: false,
    rowsPerPage: 5,
  }

  onSort = (newOrderBy: string, orderProp: boolean) => {
    const { order, orderBy } = this.state
    let newOrder = 'desc'

    if (orderBy === newOrderBy && order === 'desc') {
      newOrder = 'asc'
    }

    this.setState(() => ({
      order: newOrder,
      orderBy: newOrderBy,
      orderProp,
      fixed: false,
    }))
  }

  getEmptyStyle = (emptyRows: number) => ({
    height: FIXED_HEIGHT * emptyRows,
  })

  handleChangePage = (e: SyntheticInputEvent<HTMLInputElement>, page: number) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const rowsPerPage = Number(e.target.value)
    this.setState({ rowsPerPage })
  }

  render() {
    const {
      data, label, columns, classes, children, size, defaultOrderBy, defaultFixed,
    } = this.props
    const {
      order, orderBy, page, orderProp, rowsPerPage, fixed,
    } = this.state
    const orderByParam = orderBy || defaultOrderBy
    const fixedParam = typeof fixed !== 'undefined' ? fixed : !!defaultFixed

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

    const sortedData = stableSort(data, getSorting(order, orderByParam, orderProp), fixedParam).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    )

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
    const isEmpty = size === 0

    return (
      <React.Fragment>
        {!isEmpty && (
          <Table aria-labelledby={label} className={classes.root}>
            <TableHead columns={columns} order={order} orderBy={orderByParam} onSort={this.onSort} />
            <TableBody>
              {children(sortedData)}
              {emptyRows > 0 && (
                <TableRow style={this.getEmptyStyle(emptyRows)}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {isEmpty && (
          <Row className={classNames(classes.loader, classes.root)} style={this.getEmptyStyle(emptyRows + 1)}>
            <CircularProgress size={60} />
          </Row>
        )}
        <TablePagination
          component="div"
          count={size}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
