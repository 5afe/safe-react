import { TransferDetails } from './transferDetailsTypes'
import {
  DataDecoded,
  MultiSigTransaction,
  Operation,
  Parameter,
  Transfer,
  TransferType,
  TxConstants,
} from 'src/routes/safe/store/models/types/transactions'
import {
  extractERC20TransferDetails,
  extractERC721TransferDetails,
  extractETHTransferDetails,
  extractUnknownTransferDetails,
} from './transferDetails'
import { isMultiSendParameter } from './newTransactionHelpers'

export type MultiSendDetails = {
  operation: keyof typeof Operation
  to: string
  data: DataDecoded | null
  value: number
}

type TxDetails = MultiSendDetails | DataDecoded

export type MultiSendDecodedData = {
  txDetails?: TxDetails[] | null
  transfersDetails: TransferDetails[]
}

export const isMultiSendDetails = (details: TxDetails): details is MultiSendDetails => {
  return !!(details as MultiSendDetails)?.operation
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

export const extractMultiSendDetails = (parameter: Parameter): MultiSendDetails[] | null => {
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

  return null
}

export const extractMultiSendDecodedData = (tx: MultiSigTransaction): MultiSendDecodedData => {
  const transfersDetails = null ?? tx.transfers?.map(extractTransferDetails)

  const txDetails =
    tx.dataDecoded?.method === TxConstants.MULTI_SEND
      ? extractMultiSendDetails(tx.dataDecoded?.parameters[0])
      : [tx.dataDecoded]

  return { txDetails, transfersDetails }
}
