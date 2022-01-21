import { TransactionInfo, TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'

import { isTransferTxInfo } from 'src/logic/safe/store/models/types/gateway.d'

export const isOutgoingTransfer = (value: TransactionInfo): boolean => {
  return !!value && isTransferTxInfo(value) && value.direction === TransferDirection.OUTGOING
}

export const isIncomingTransfer = (value?: TransactionInfo): boolean => {
  return !!value && isTransferTxInfo(value) && value.direction === TransferDirection.INCOMING
}
