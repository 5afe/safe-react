import React from 'react'

import Layout from '.'
import Sidebar from './Sidebar'
import { ListItemType } from '../List'
import { Icon } from '@gnosis.pm/safe-react-components'

export default {
  title: 'Layout',
  component: Layout,
  parameters: {
    componentSubtitle: 'It provides a custom layout used in Safe Multisig',
  },
}

const items: ListItemType[] = [
  {
    label: 'Assets',
    icon: <Icon size="md" type="assets" />,
    onItemClick: () => console.log('assets'),
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

export const Base = (): React.ReactElement => {
  const topbar = <div>Gnosis Logo</div>
  const sidebar = (
    <Sidebar
      items={items}
      safeAddress="0xEE63624cC4Dd2355B16b35eFaadF3F7450A9438B"
      safeName="someName"
      granted={true}
      balance={null}
      onToggleSafeList={() => console.log}
      onReceiveClick={() => console.log}
      onNewTransactionClick={() => console.log}
    />
  )
  const body = <div>This is some body</div>

  return <Layout topbar={topbar} sidebar={sidebar} body={body} />
}
