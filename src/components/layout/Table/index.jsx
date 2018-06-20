// @flow
import * as React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

export { TableBody, TableCell, TableHead, TableRow }

type Props = {
  children: React$Node,
  size?: number
}

const buildWidthFrom = (size: number) => ({
  minWidth: `${size}px`,
})

const overflowStyle = {
  overflowX: 'scroll',
}

// see: https://css-tricks.com/responsive-data-tables/
const GnoTable = ({ size, children }: Props) => {
  const style = size ? buildWidthFrom(size) : undefined

  return (
    <div style={overflowStyle}>
      <Table style={style}>
        {children}
      </Table>
    </div>
  )
}

export default GnoTable

