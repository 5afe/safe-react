export interface IncomingTransferDetails {
  from: string
}

export interface OutgoingTransferDetails {
  to: string
}

export interface IERC20TransferDetails {
  tokenAddress: string
  value: string
  name: string
  txHash: string | null
}

export interface IncomingERC20TransferDetails extends IERC20TransferDetails, IncomingTransferDetails {}

export interface OutgoingERC20TransferDetails extends IERC20TransferDetails, OutgoingTransferDetails {}

export type ERC20TransferDetails = IncomingERC20TransferDetails | OutgoingERC20TransferDetails

export interface IERC721TransferDetails {
  tokenAddress: string
  tokenId: string | null
  txHash: string | null
}

export interface IncomingERC721TransferDetails extends IERC721TransferDetails, IncomingTransferDetails {}

export interface OutgoingERC721TransferDetails extends IERC721TransferDetails, OutgoingTransferDetails {}

export type ERC721TransferDetails = IncomingERC721TransferDetails | OutgoingERC721TransferDetails

export interface IETHTransferDetails {
  value: string
  txHash: string | null
}

export interface IncomingETHTransferDetails extends IETHTransferDetails, IncomingTransferDetails {}

export interface OutgoingETHTransferDetails extends IETHTransferDetails, OutgoingTransferDetails {}

export type ETHTransferDetails = IncomingETHTransferDetails | OutgoingETHTransferDetails

export interface UnknownTransferDetails extends IncomingTransferDetails, OutgoingTransferDetails {
  value: string
  txHash: string
}

export type TransferDetails = ERC20TransferDetails | ERC721TransferDetails | ETHTransferDetails | UnknownTransferDetails
