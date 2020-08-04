import React from 'react'

import Layout from './index'

export default {
  title: 'Data Display/Layout',
  component: Layout,
  parameters: {
    componentSubtitle: 'It provides a custom layout used in Safe Multisig',
  },
}

export const SimpleLayout = (): React.ReactElement => <Layout />
