import React from 'react'

import Sidebar from './index'

export default {
  title: 'Layout/Sidebar',
  component: Sidebar,
}

export const Base = (): React.ReactElement => (
  <Sidebar
    balance="111"
    safeAddress="0xEE63624cC4Dd2355B16b35eFaadF3F7450A9438B"
    safeName="someName"
    granted={true}
    onReceiveClick={console.log}
    onNewTransactionClick={console.log}
    onToggleSafeList={() => console.log}
  />
)
