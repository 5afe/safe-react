import { TransferDetails } from './transferDetails.d'
import {
  DataDecoded,
  Operation,
  Parameter,
  Transfer,
  TransferType,
} from 'src/logic/safe/store/models/types/transactions.d'

import {
  extractERC20TransferDetails,
  extractERC721TransferDetails,
  extractETHTransferDetails,
  extractUnknownTransferDetails,
} from './transferDetails'
import { isMultiSendParameter } from './newTransactionHelpers'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'

export type MultiSendDetails = {
  operation: Operation
  to: string
  data: DataDecoded | null
  value: number
}

export type MultiSendDataDecoded = {
  txDetails?: MultiSendDetails[]
  transfersDetails?: TransferDetails[]
}

export const extractTransferDetails = (transfer: Transfer): TransferDetails => {
  switch (TransferType[transfer.type]) {
    case TransferType.ERC20_TRANSFER:
      return extractERC20TransferDetails(transfer)
    case TransferType.ERC721_TRANSFER:
      return extractERC721TransferDetails(transfer)
    case TransferType.ETHER_TRANSFER:
      return extractETHTransferDetails(transfer)
    default:
      return extractUnknownTransferDetails(transfer)
  }
}

export const extractMultiSendDetails = (parameter: Parameter): MultiSendDetails[] | undefined => {
  if (isMultiSendParameter(parameter)) {
    return parameter.valueDecoded.map((valueDecoded) => {
      return {
        operation: valueDecoded.operation,
        to: valueDecoded.to,
        value: valueDecoded.value,
        data: valueDecoded?.dataDecoded ?? null,
      }
    })
  }
}

export const extractMultiSendDataDecoded = (tx: Transaction): MultiSendDataDecoded => {
  const transfersDetails = tx.transfers?.map(extractTransferDetails)
  const txDetails = tx.dataDecoded?.parameters[0] ? extractMultiSendDetails(tx.dataDecoded?.parameters[0]) : undefined

  return { txDetails, transfersDetails }
}
