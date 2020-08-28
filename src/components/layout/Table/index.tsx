import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import * as React from 'react'

export { TableBody, TableCell, TableHead, TableRow }

const buildWidthFrom = (size) => ({
  minWidth: `${size}px`,
})

const overflowStyle: any = {
  overflowX: 'auto',
}

// see: https://css-tricks.com/responsive-data-tables/
const GnoTable = ({ children, size }) => {
  const style = size ? buildWidthFrom(size) : undefined

  return (
    <div style={overflowStyle}>
      <Table style={style}>{children}</Table>
    </div>
  )
}

export default GnoTable
