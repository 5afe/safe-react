import React from 'react'

import Sidebar from './index'

export default {
  title: 'Layout/Sidebar',
  component: Sidebar,
}

export const Base = (): React.ReactElement => (
  <Sidebar onReceiveClick={console.log} onNewTransactionClick={console.log} onToggleSafeList={() => console.log} />
)
