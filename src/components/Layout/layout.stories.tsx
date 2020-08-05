import React from 'react'

import Layout from './Layout'

export default {
  title: 'Layout',
  component: Layout,
  parameters: {
    componentSubtitle: 'It provides a custom layout used in Safe Multisig',
  },
}

export const Base = (): React.ReactElement => <Layout />
