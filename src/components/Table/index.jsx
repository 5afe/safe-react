// @flow
import * as React from 'react'
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
  defaultFixed: boolean,
  defaultRowsPerPage: number,
  defaultOrder: 'desc' | 'asc',
  noBorder: boolean,
  disablePagination: boolean,
}

type State = {
  page: number,
  order?: Order,
  orderBy?: string,
  orderProp: boolean,
  rowsPerPage?: number,
  fixed?: boolean,
}

const styles = {
  root: {
    backgroundColor: 'white',
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
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
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    marginBottom: xl,
    borderBottomRightRadius: '8px',
    borderBottomLeftRadius: '8px',
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
  constructor(props) {
    super(props)

    this.state = {
      page: 0,
      order: undefined,
      orderBy: undefined,
      fixed: undefined,
      orderProp: false,
      rowsPerPage: undefined,
    }
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
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
    backgroundColor: 'white',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
      data,
      label,
      columns,
      classes,
      children,
      size,
      disablePagination,
      defaultOrderBy,
      defaultOrder,
      defaultFixed,
      defaultRowsPerPage,
      noBorder,
    } = this.props
    const {
      order, orderBy, page, orderProp, rowsPerPage, fixed,
    } = this.state
    const orderByParam = orderBy || defaultOrderBy
    const orderParam = order || defaultOrder
    const displayRows = rowsPerPage || defaultRowsPerPage
    const fixedParam = typeof fixed !== 'undefined' ? fixed : !!defaultFixed

    const paginationClasses = {
      selectRoot: classes.selectRoot,
      root: !noBorder && classes.paginationRoot,
      input: classes.white,
    }

    let sortedData = stableSort(data, getSorting(orderParam, orderByParam, orderProp), fixedParam)

    if (!disablePagination) {
      sortedData = sortedData.slice(page * displayRows, page * displayRows + displayRows)
    }

    const emptyRows = displayRows - Math.min(displayRows, data.length - page * displayRows)
    const isEmpty = size === 0

    return (
      <>
        {!isEmpty && (
          <Table aria-labelledby={label} className={noBorder ? '' : classes.root}>
            <TableHead columns={columns} order={order} orderBy={orderByParam} onSort={this.onSort} />
            <TableBody>{children(sortedData)}</TableBody>
          </Table>
        )}
        {isEmpty && (
          <Row
            className={classes.loader}
            style={this.getEmptyStyle(emptyRows + 1)}
          >
            <CircularProgress size={60} />
          </Row>
        )}
        {!disablePagination && (
          <TablePagination
            component="div"
            count={size}
            rowsPerPage={displayRows}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            page={page}
            backIconButtonProps={backProps}
            nextIconButtonProps={nextProps}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            classes={paginationClasses}
          />
        )}
      </>
    )
  }
}

GnoTable.defaultProps = {
  defaultOrder: 'asc',
  disablePagination: false,
  defaultRowsPerPage: 5,
}

export default withStyles(styles)(GnoTable)
