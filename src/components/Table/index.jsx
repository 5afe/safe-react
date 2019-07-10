// @flow
import * as React from 'react'
import classNames from 'classnames'
import { List } from 'immutable'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import TablePagination from '@material-ui/core/TablePagination'
import Row from '~/components/layout/Row'
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
  defaultOrder?: 'desc' | 'asc',
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

const backProps = {
  'aria-label': 'Previous Page',
}

const nextProps = {
  'aria-label': 'Next Page',
}

class GnoTable<K> extends React.Component<Props<K>, State> {
  state = {
    page: 0,
    order: undefined,
    orderBy: undefined,
    fixed: undefined,
    orderProp: false,
    rowsPerPage: 5,
  }

  componentDidMount() {
    const { defaultOrderBy, columns } = this.props

    if (defaultOrderBy && columns) {
      const defaultOrderCol = columns.find(({ id }) => id === defaultOrderBy)

      if (defaultOrderCol.order) {
        this.setState({
          orderProp: true,
        })
      }
    }
  }

  onSort = (newOrderBy: string, orderProp: boolean) => {
    const { order, orderBy } = this.state
    const { defaultOrder } = this.props
    let newOrder = 'desc'

    // if table was previously sorted by the user
    if (order && orderBy === newOrderBy && order === 'desc') {
      newOrder = 'asc'
    } else if (!order && defaultOrder === 'desc') {
      // if it was not sorted and defaultOrder is used
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
      data, label, columns, classes, children, size, defaultOrderBy, defaultOrder, defaultFixed,
    } = this.props
    const {
      order, orderBy, page, orderProp, rowsPerPage, fixed,
    } = this.state
    const orderByParam = orderBy || defaultOrderBy
    const orderParam = order || defaultOrder
    const fixedParam = typeof fixed !== 'undefined' ? fixed : !!defaultFixed

    const paginationClasses = {
      selectRoot: classes.selectRoot,
      root: classes.paginationRoot,
      input: classes.white,
    }

    const sortedData = stableSort(data, getSorting(orderParam, orderByParam, orderProp), fixedParam).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    )

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)
    const isEmpty = size === 0

    return (
      <React.Fragment>
        {!isEmpty && (
          <Table aria-labelledby={label} className={classes.root}>
            <TableHead columns={columns} order={orderParam} orderBy={orderByParam} onSort={this.onSort} />
            <TableBody>{children(sortedData)}</TableBody>
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

GnoTable.defaultProps = {
  defaultOrder: 'asc',
}

export default withStyles(styles)(GnoTable)
