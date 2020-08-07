import React from 'react'

import Layout from './SidebarLayout'
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
  const sidebar = <Sidebar />
  const body = <div>This is some body</div>

  return <Layout topbar={topbar} sidebar={sidebar} body={body} />
}
