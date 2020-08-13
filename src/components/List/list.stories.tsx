import React from 'react'
import { Icon } from '@gnosis.pm/safe-react-components'

import List, { ListItemType } from './index'

const items: ListItemType[] = [
  {
    label: 'Assets',
    icon: <Icon size="md" type="assets" />,
    selected: true,
    onItemClick: () => console.log('assets'),
  },
  {
    label: 'Transactions',
    icon: <Icon size="md" type="transactionsInactive" />,
    onItemClick: () => console.log('Transactions'),
  },
  {
    label: 'AddressBook',
    icon: <Icon size="md" type="addressBook" />,
    onItemClick: () => console.log('AddressBook'),
  },
  {
    label: 'Apps',
    icon: <Icon size="md" type="apps" />,
    onItemClick: () => console.log('Apps'),
  },
  {
    label: 'Settings',
    icon: <Icon size="md" type="settings" />,
    onItemClick: () => console.log('Settings'),
    subItems: [
      {
        label: 'Safe Details',
        onItemClick: () => console.log('Settings1'),
      },
      {
        label: 'Owners',
        onItemClick: () => console.log('Settings2'),
      },
      {
        label: 'Policies',
        onItemClick: () => console.log('Settings3'),
      },
      {
        label: 'Advanced',
        onItemClick: () => console.log('Settings4'),
      },
    ],
  },
]

export default {
  title: 'Data Display/List',
  component: List,
}

export const SimpleList = (): React.ReactElement => <List items={items} />
