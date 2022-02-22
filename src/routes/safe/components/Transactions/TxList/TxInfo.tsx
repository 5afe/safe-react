import { SettingsChange, TransactionInfo, TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'

import { isSettingsChangeTxInfo, isTransferTxInfo } from 'src/logic/safe/store/models/types/gateway.d'
import { TxInfoSettings } from './TxInfoSettings'
import { TxInfoTransfer } from './TxInfoTransfer'

export const TxInfo = ({
  txInfo,
  txStatus,
}: {
  txInfo: TransactionInfo
  txStatus: TransactionStatus
}): ReactElement | null => {
  if (isSettingsChangeTxInfo(txInfo)) {
    return <TxInfoSettings settingsInfo={(txInfo as SettingsChange).settingsInfo} />
  }

  if (isTransferTxInfo(txInfo)) {
    return <TxInfoTransfer txInfo={txInfo} txStatus={txStatus} />
  }

  return null
}
