import React from 'react'
import { Icon } from '@gnosis.pm/safe-react-components'

import List, { ListItemType } from './index'

const items: ListItemType[] = [
  {
    label: 'Assets',
    icon: <Icon color="placeHolder" size="md" type="assets" />,
    selected: true,
    onItemClick: () => console.log('assets'),
    subItems: [
      {
        icon: <Icon color="icon" size="md" type="assets" />,
        label: 'Coins',
        onItemClick: () => console.log('Coins'),
      },
      {
        icon: <Icon color="icon" size="md" type="collectibles" />,
        label: 'Collectives',
        onItemClick: () => console.log('Collectives'),
      },
    ],
  },
  {
    label: 'Transactions',
    icon: <Icon color="placeHolder" size="md" type="transactionsInactive" />,
    onItemClick: () => console.log('Transactions'),
  },
  {
    label: 'AddressBook',
    icon: <Icon color="placeHolder" size="md" type="addressBook" />,
    onItemClick: () => console.log('AddressBook'),
  },
  {
    label: 'Apps',
    icon: <Icon color="placeHolder" size="md" type="apps" />,
    onItemClick: () => console.log('Apps'),
    subItems: [
      {
        icon: <Icon color="icon" size="md" type="apps" />,
        label: 'App 1',
        onItemClick: () => console.log('App 1'),
      },
      {
        icon: <Icon color="icon" size="md" type="apps" />,
        label: 'App 2',
        onItemClick: () => console.log('App 2'),
      },
    ],
  },
  {
    label: 'Settings',
    icon: <Icon color="placeHolder" size="md" type="settings" />,
    onItemClick: () => console.log('Settings'),
    subItems: [
      {
        icon: <Icon color="icon" size="md" type="info" />,
        label: 'Safe Details',
        onItemClick: () => console.log('Settings1'),
      },
      {
        icon: <Icon color="icon" size="md" type="owners" />,
        label: 'Owners',
        onItemClick: () => console.log('Settings2'),
      },
      {
        icon: <Icon color="icon" size="md" type="requiredConfirmations" />,
        label: 'Policies',
        onItemClick: () => console.log('Settings3'),
      },
      {
        icon: <Icon color="icon" size="md" type="settingsTool" />,
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
