export interface IncomingTransferDetails {
  from: string
}

export interface OutgoingTransferDetails {
  to: string
}

export interface CommonERC20TransferDetails {
  tokenAddress: string
  value: string
  name: string
  txHash: string | null
}

export interface IncomingERC20TransferDetails extends CommonERC20TransferDetails, IncomingTransferDetails {}

export interface OutgoingERC20TransferDetails extends CommonERC20TransferDetails, OutgoingTransferDetails {}

export type ERC20TransferDetails = IncomingERC20TransferDetails | OutgoingERC20TransferDetails

export interface CommonERC721TransferDetails {
  tokenAddress: string
  tokenId: string | null
  txHash: string | null
}

export interface IncomingERC721TransferDetails extends CommonERC721TransferDetails, IncomingTransferDetails {}

export interface OutgoingERC721TransferDetails extends CommonERC721TransferDetails, OutgoingTransferDetails {}

export type ERC721TransferDetails = IncomingERC721TransferDetails | OutgoingERC721TransferDetails

export interface CommonETHTransferDetails {
  value: string
  txHash: string | null
}

export interface IncomingETHTransferDetails extends CommonETHTransferDetails, IncomingTransferDetails {}

export interface OutgoingETHTransferDetails extends CommonETHTransferDetails, OutgoingTransferDetails {}

export type ETHTransferDetails = IncomingETHTransferDetails | OutgoingETHTransferDetails

export interface UnknownTransferDetails extends IncomingTransferDetails, OutgoingTransferDetails {
  value: string
  txHash: string
}

export type TransferDetails = ERC20TransferDetails | ERC721TransferDetails | ETHTransferDetails | UnknownTransferDetails
