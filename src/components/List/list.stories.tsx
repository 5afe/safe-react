import React from 'react'

import List, { ListItemType } from '.'
import ListIcon from './ListIcon'

const items: ListItemType[] = [
  {
    label: 'Assets',
    icon: <ListIcon type="assets" />,
    href: '#',
    subItems: [
      {
        icon: <ListIcon type="assets" />,
        label: 'Coins',
        href: '#',
      },
      {
        icon: <ListIcon type="collectibles" />,
        selected: true,
        label: 'Collectives',
        href: '#',
      },
    ],
  },
  {
    label: 'Transactions',
    icon: <ListIcon type="transactionsInactive" />,
    href: '#',
  },
]

export default {
  title: 'Data Display/List',
  component: List,
}

export const SimpleList = (): React.ReactElement => <List items={items} />
