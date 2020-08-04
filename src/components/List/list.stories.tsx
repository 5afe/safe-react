import React from 'react'

import NestedList from './index'

export default {
  title: 'Data Display/List',
  component: NestedList,
  parameters: {
    componentSubtitle: 'Nested List',
  },
}

export const SimpleList = (): React.ReactElement => <NestedList />
