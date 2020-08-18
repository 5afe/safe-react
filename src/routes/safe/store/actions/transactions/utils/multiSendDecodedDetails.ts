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
  operation: keyof typeof Operation
  to: string
  data: DataDecoded | null
  value: number
}

export type MultiSendDecodedData = {
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
    return parameter.decodedValue.map((decodedValue) => {
      return {
        operation: decodedValue.operation,
        to: decodedValue.to,
        value: decodedValue.value,
        data: decodedValue?.decodedData ?? null,
      }
    })
  }
}

export const extractMultiSendDecodedData = (tx: Transaction): MultiSendDecodedData => {
  const transfersDetails = tx.transfers?.map(extractTransferDetails)
  const txDetails = extractMultiSendDetails(tx.dataDecoded?.parameters[0])

  return { txDetails, transfersDetails }
}
