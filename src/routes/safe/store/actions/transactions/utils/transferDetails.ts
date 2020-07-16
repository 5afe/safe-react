import { Transfer, TxConstants } from 'src/routes/safe/store/models/types/transactions'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { store } from 'src/store'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import {
  ERC20TransferDetails,
  ERC721TransferDetails,
  ETHTransferDetails,
  UnknownTransferDetails,
} from './transferDetailsTypes'
import { humanReadableValue } from 'src/utils/humanReadableValue'

const isIncomingTransfer = (transfer: Transfer): boolean => {
  const state = store.getState()
  const safeAddress = safeParamAddressFromStateSelector(state)
  return sameAddress(transfer.to, safeAddress)
}

export const extractERC20TransferDetails = (transfer: Transfer): ERC20TransferDetails => {
  const erc20TransferDetails = {
    tokenAddress: transfer.tokenInfo?.address || TxConstants.UNKNOWN,
    value: humanReadableValue(transfer.value, transfer.tokenInfo?.decimals),
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
    value: humanReadableValue(transfer.value),
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
