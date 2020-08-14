import React from 'react'

import List, { ListItemType } from '.'
import ListIcon from './ListIcon'

const items: ListItemType[] = [
  {
    label: 'Assets',
    icon: <ListIcon type="assets" />,
    onItemClick: () => console.log('assets'),
    subItems: [
      {
        icon: <ListIcon type="assets" />,
        label: 'Coins',
        onItemClick: () => console.log('Coins'),
      },
      {
        icon: <ListIcon type="collectibles" />,
        selected: true,
        label: 'Collectives',
        onItemClick: () => console.log('Collectives'),
      },
    ],
  },
  {
    label: 'Transactions',
    icon: <ListIcon type="transactionsInactive" />,
    onItemClick: () => console.log('Transactions'),
  },
  {
    label: 'AddressBook',
    icon: <ListIcon type="addressBook" />,
    onItemClick: () => console.log('AddressBook'),
  },
  {
    label: 'Apps',
    icon: <ListIcon type="apps" />,
    onItemClick: () => console.log('Apps'),
    subItems: [
      {
        icon: <ListIcon type="apps" />,
        label: 'App 1',
        onItemClick: () => console.log('App 1'),
      },
      {
        icon: <ListIcon type="apps" />,
        label: 'App 2',
        onItemClick: () => console.log('App 2'),
      },
    ],
  },
  {
    label: 'Settings',
    icon: <ListIcon type="settings" />,
    onItemClick: () => console.log('Settings'),
    subItems: [
      {
        icon: <ListIcon type="info" />,
        label: 'Safe Details',
        onItemClick: () => console.log('Settings1'),
      },
      {
        icon: <ListIcon type="owners" />,
        label: 'Owners',
        onItemClick: () => console.log('Settings2'),
      },
      {
        icon: <ListIcon type="requiredConfirmations" />,
        label: 'Policies',
        onItemClick: () => console.log('Settings3'),
      },
      {
        icon: <ListIcon type="settingsTool" />,
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
