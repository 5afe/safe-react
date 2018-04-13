// @flow
import * as React from 'react'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

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

