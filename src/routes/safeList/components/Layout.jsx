// @flow
import { List } from 'immutable'
import * as React from 'react'
import Table, { TableBody, TableCell, TableHead, TableRow } from '~/components/layout/Table'
import { type Safe } from '~/routes/safe/store/model/safe'

type Props = {
  safes: List<Safe>
}

const SafeList = ({ safes }: Props) => (
  <Table size={700}>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Deployed Address</TableCell>
        <TableCell numeric>Confirmations</TableCell>
        <TableCell numeric>Number of owners</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {safes.map(safe => (
        <TableRow key={safe.address}>
          <TableCell padding="none">{safe.name}</TableCell>
          <TableCell padding="none">{safe.address}</TableCell>
          <TableCell padding="none" numeric>{safe.confirmations}</TableCell>
          <TableCell padding="none" numeric>{safe.owners.count()}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export default SafeList
