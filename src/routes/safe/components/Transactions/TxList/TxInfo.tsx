import React, { ReactElement } from 'react'

import { TransactionInfo, isSettingsChangeTxInfo, isTransferTxInfo } from 'src/logic/safe/store/models/types/gateway.d'
import { TxInfoSettings } from './TxInfoSettings'
import { TxInfoTransfer } from './TxInfoTransfer'

export const TxInfo = ({ txInfo }: { txInfo: TransactionInfo }): ReactElement | null => {
  if (isSettingsChangeTxInfo(txInfo)) {
    return <TxInfoSettings settingsInfo={txInfo.settingsInfo} />
  }

  if (isTransferTxInfo(txInfo)) {
    return <TxInfoTransfer txInfo={txInfo} />
  }

  return null
}
