import { Transfer, TxConstants } from 'src/routes/safe/store/models/types/transactions.d'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { store } from 'src/store'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import {
  ERC20TransferDetails,
  ERC721TransferDetails,
  ETHTransferDetails,
  UnknownTransferDetails,
} from './transferDetails.d'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'

const isIncomingTransfer = (transfer: Transfer): boolean => {
  // TODO: prevent using `store` here and receive `safeAddress` as a param
  const state = store.getState()
  const safeAddress = safeParamAddressFromStateSelector(state)
  return sameAddress(transfer.to, safeAddress)
}

export const extractERC20TransferDetails = (transfer: Transfer): ERC20TransferDetails => {
  const erc20TransferDetails = {
    tokenAddress: transfer.tokenInfo?.address || TxConstants.UNKNOWN,
    value: humanReadableValue(transfer.value || 0, transfer.tokenInfo?.decimals),
    name: transfer.tokenInfo?.name || transfer.tokenInfo?.symbol || TxConstants.UNKNOWN,
    txHash: transfer.transactionHash,
  }

  if (isIncomingTransfer(transfer)) {
    return {
      ...erc20TransferDetails,
      from: transfer.from,
    }
  }

  return {
    ...erc20TransferDetails,
    to: transfer.to,
  }
}

export const extractERC721TransferDetails = (transfer: Transfer): ERC721TransferDetails => {
  const erc721TransferDetails = {
    tokenAddress: transfer.tokenAddress,
    tokenId: transfer.tokenId,
    txHash: transfer.transactionHash,
  }
  if (isIncomingTransfer(transfer)) {
    return {
      ...erc721TransferDetails,
      from: transfer.from,
    }
  }

  return {
    ...erc721TransferDetails,
    to: transfer.to,
  }
}

export const extractETHTransferDetails = (transfer: Transfer): ETHTransferDetails => {
  const ethTransferDetails = {
    value: humanReadableValue(transfer.value || 0),
    txHash: transfer.transactionHash,
  }
  if (isIncomingTransfer(transfer)) {
    return {
      ...ethTransferDetails,
      from: transfer.from,
    }
  }

  return {
    ...ethTransferDetails,
    to: transfer.to,
  }
}

export const extractUnknownTransferDetails = (transfer: Transfer): UnknownTransferDetails => {
  return {
    value: transfer?.value || TxConstants.UNKNOWN,
    txHash: transfer?.transactionHash || TxConstants.UNKNOWN,
    to: transfer?.to || TxConstants.UNKNOWN,
    from: transfer?.from || TxConstants.UNKNOWN,
  }
}
