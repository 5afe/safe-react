import { Loader } from '@gnosis.pm/safe-react-components'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TablePagination from '@material-ui/core/TablePagination'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import TableHead from 'src/components/Table/TableHead'
import { getSorting, stableSort } from 'src/components/Table/sorting'
import Row from 'src/components/layout/Row'
import { sm, xl, xxl } from 'src/theme/variables'

const styles = {
  root: {
    backgroundColor: 'white',
    borderTopRightRadius: sm,
    borderTopLeftRadius: sm,
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
  },
  selectRoot: {
    lineHeight: xxl,
    backgroundColor: 'white',
  },
  white: {
    backgroundColor: 'white',
  },
  paginationRoot: {
    backgroundColor: 'white',
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    marginBottom: xl,
    borderBottomRightRadius: sm,
    borderBottomLeftRadius: sm,
  },
  loader: {
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
  },
}

const FIXED_EMPTY_HEIGHT = 255

const backProps = {
  'aria-label': 'Previous Page',
}

const nextProps = {
  'aria-label': 'Next Page',
}

class GnoTable extends React.Component<any, any> {
  static defaultProps = {
    defaultOrder: 'asc',
    disablePagination: false,
    defaultRowsPerPage: 5,
  }

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
    const { columns, defaultOrderBy } = this.props

    if (defaultOrderBy && columns) {
      const defaultOrderCol = columns.find(({ id }) => id === defaultOrderBy)

      if (defaultOrderCol.order) {
        this.setState({
          orderProp: true,
        })
      }
    }
  }

  onSort = (newOrderBy, orderProp) => {
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

  getEmptyStyle = () => ({
    height: `calc(100vh - ${FIXED_EMPTY_HEIGHT}px)`,
    borderTopRightRadius: sm,
    borderTopLeftRadius: sm,
    backgroundColor: 'white',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })

  handleChangePage = (e, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (e) => {
    const rowsPerPage = Number(e.target.value)
    this.setState({ rowsPerPage })
  }

  render() {
    const {
      children,
      classes,
      columns,
      data,
      defaultFixed,
      defaultOrder,
      defaultOrderBy,
      defaultRowsPerPage,
      disableLoadingOnEmptyTable,
      disablePagination,
      label,
      noBorder,
      size,
    }: any = this.props
    const { fixed, order, orderBy, orderProp, page, rowsPerPage } = this.state
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

    const isEmpty = size === 0 && !disableLoadingOnEmptyTable

    return (
      <>
        {!isEmpty && (
          <Table aria-labelledby={label} className={noBorder ? '' : classes.root}>
            <TableHead columns={columns} onSort={this.onSort} order={order} orderBy={orderByParam} />
            <TableBody>{children(sortedData)}</TableBody>
          </Table>
        )}
        {isEmpty && (
          <Row className={classes.loader} style={this.getEmptyStyle()}>
            <Loader size="sm" />
          </Row>
        )}
        {!disablePagination && (
          <TablePagination
            backIconButtonProps={backProps}
            classes={paginationClasses}
            component="div"
            count={size}
            nextIconButtonProps={nextProps}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={displayRows}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        )}
      </>
    )
  }
}

export default withStyles(styles as any)(GnoTable)
