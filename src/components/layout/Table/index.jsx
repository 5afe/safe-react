// @flow
import * as React from 'react'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

export { TableBody, TableCell, TableHead, TableRow }

type Props = {
  children: React$Node,
  size: number
}

const buildWidthFrom = (size: number) => ({
  minWidth: `${size}px`,
})

// see: https://css-tricks.com/responsive-data-tables/
const GnoTable = ({ size, children }: Props) => {
  const style = buildWidthFrom(size)

  return (
    <Table style={style}>
      {children}
    </Table>
  )
}

export default GnoTable

