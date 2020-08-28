import React from 'react'

import WalletInfo from './index'

export default {
  title: 'Layout/WalletInfo',
  component: WalletInfo,
}

export const SimpleLayout = (): React.ReactElement => (
  <WalletInfo
    address="0xEE63624cC4Dd2355B16b35eFaadF3F7450A9438B"
    granted={true}
    safeName="My Wallet"
    balance="$111,111"
    onToggleSafeList={() => ({})}
    onReceiveClick={console.log}
    onNewTransactionClick={console.log}
  />
)
