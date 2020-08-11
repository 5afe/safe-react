import React from 'react'

import Layout from '.'
import Sidebar from './Sidebar'

export default {
  title: 'Layout',
  component: Layout,
  parameters: {
    componentSubtitle: 'It provides a custom layout used in Safe Multisig',
  },
}

export const Base = (): React.ReactElement => {
  const topbar = <div>Gnosis Logo</div>
  const sidebar = (
    <Sidebar
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
