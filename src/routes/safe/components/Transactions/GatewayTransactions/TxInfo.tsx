import React, { ReactElement } from 'react'

import {
  ExpandedTxDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
} from 'src/logic/safe/store/models/types/gateway.d'
import { TxInfoSettings } from './TxInfoSettings'
import { TxInfoTransfer } from './TxInfoTransfer'

type TxInfoProps = {
  txInfo: ExpandedTxDetails['txInfo']
}

export const TxInfo = ({ txInfo }: TxInfoProps): ReactElement | null => {
  if (isSettingsChangeTxInfo(txInfo)) {
    return <TxInfoSettings settingsInfo={txInfo.settingsInfo} />
  }

  if (isTransferTxInfo(txInfo)) {
    return <TxInfoTransfer txInfo={txInfo} />
  }

  return null
}
