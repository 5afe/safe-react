import { Transaction } from 'src/logic/safe/store/models/types/transaction'
import { SAFE_METHODS_NAMES, SafeMethods, TokenDecodedParams } from 'src/logic/safe/store/models/types/transactions.d'
import { sameString } from 'src/utils/strings'
import { getNetworkInfo } from 'src/config'

const getSafeVersion = (data) => {
  const contractAddress = data.substr(340, 40).toLowerCase()

  return (
    {
      '34cfac646f301356faa8b21e94227e3583fe3f5f': '1.1.1',
    }[contractAddress] || 'X.x.x'
  )
}

interface TxData {
  data?: string | null
  recipient?: string
  module?: string
  action?: SafeMethods
  addedOwner?: string
  removedOwner?: string
  newThreshold?: string
  tokenId?: string
  isTokenTransfer?: boolean
  isCollectibleTransfer?: boolean
  modifySettingsTx?: boolean
  customTx?: boolean
  cancellationTx?: boolean
  creationTx?: boolean
  upgradeTx?: boolean
  tokenAddress?: string
}

const getTxDataForModifySettingsTxs = (tx: Transaction): TxData => {
  const txData: TxData = {}

  if (!tx.modifySettingsTx || !tx.decodedParams) {
    return txData
  }

  txData.recipient = tx.recipient
  txData.modifySettingsTx = true

  if (tx.decodedParams[SAFE_METHODS_NAMES.REMOVE_OWNER]) {
    const { _threshold, owner } = tx.decodedParams[SAFE_METHODS_NAMES.REMOVE_OWNER]
    txData.action = SAFE_METHODS_NAMES.REMOVE_OWNER
    txData.removedOwner = owner
    txData.newThreshold = _threshold

    return txData
  }
  if (tx.decodedParams[SAFE_METHODS_NAMES.CHANGE_THRESHOLD]) {
    const { _threshold } = tx.decodedParams[SAFE_METHODS_NAMES.CHANGE_THRESHOLD]
    txData.action = SAFE_METHODS_NAMES.CHANGE_THRESHOLD
    txData.newThreshold = _threshold
    return txData
  }
  if (tx.decodedParams[SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD]) {
    const { _threshold, owner } = tx.decodedParams[SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD]
    txData.action = SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD
    txData.addedOwner = owner
    txData.newThreshold = _threshold
    return txData
  }

  if (tx.decodedParams[SAFE_METHODS_NAMES.SWAP_OWNER]) {
    const { newOwner, oldOwner } = tx.decodedParams[SAFE_METHODS_NAMES.SWAP_OWNER]
    txData.action = SAFE_METHODS_NAMES.SWAP_OWNER
    txData.removedOwner = oldOwner
    txData.addedOwner = newOwner
    return txData
  }

  if (tx.decodedParams[SAFE_METHODS_NAMES.ENABLE_MODULE]) {
    const { module } = tx.decodedParams[SAFE_METHODS_NAMES.ENABLE_MODULE]
    txData.action = SAFE_METHODS_NAMES.ENABLE_MODULE
    txData.module = module
    return txData
  }

  if (tx.decodedParams[SAFE_METHODS_NAMES.DISABLE_MODULE]) {
    const { module } = tx.decodedParams[SAFE_METHODS_NAMES.DISABLE_MODULE]
    txData.action = SAFE_METHODS_NAMES.DISABLE_MODULE
    txData.module = module
    return txData
  }

  return txData
}

const getTxDataForTxsWithDecodedParams = (tx: Transaction): TxData => {
  const txData: TxData = {}

  if (!tx.decodedParams) {
    return txData
  }

  if (tx.isTokenTransfer) {
    const { to } = (tx.decodedParams as TokenDecodedParams).transfer || {}
    txData.recipient = to
    txData.isTokenTransfer = true
    txData.tokenAddress = tx.recipient
    return txData
  }

  if (tx.isCollectibleTransfer) {
    const { safeTransferFrom, transfer, transferFrom } = tx.decodedParams as TokenDecodedParams
    const { to, value } = safeTransferFrom || transferFrom || transfer || {}
    txData.recipient = to
    txData.tokenId = value
    txData.isCollectibleTransfer = true

    return txData
  }

  if (tx.modifySettingsTx) {
    return getTxDataForModifySettingsTxs(tx)
  }

  if (tx.multiSendTx) {
    txData.recipient = tx.recipient
    txData.data = tx.data
    txData.customTx = true
    return txData
  }

  txData.recipient = tx.recipient
  txData.data = tx.data
  txData.customTx = true

  return txData
}

// @todo (agustin) this function does not makes much sense
// it should be refactored to simplify unnecessary if's checks and re-asigning props to the txData object
export const getTxData = (tx: Transaction): TxData => {
  const txData: TxData = {}

  const { nativeCoin } = getNetworkInfo()
  if (sameString(tx.type, 'outgoing') && tx.symbol && sameString(tx.symbol, nativeCoin.symbol)) {
    txData.isTokenTransfer = true
    txData.tokenAddress = nativeCoin.address
  }

  if (tx.decodedParams) {
    return getTxDataForTxsWithDecodedParams(tx)
  }

  if (tx.customTx) {
    txData.recipient = tx.recipient
    txData.data = tx.data
    txData.customTx = true
    return txData
  }
  if (Number(tx.value) > 0) {
    txData.recipient = tx.recipient
    return txData
  }

  if (tx.isCancellationTx) {
    txData.cancellationTx = true
    return txData
  }

  if (tx.creationTx) {
    txData.creationTx = true
    return txData
  }

  if (tx.upgradeTx) {
    txData.upgradeTx = true
    txData.data = `The contract of this Safe is upgraded to Version ${getSafeVersion(tx.data)}`

    return txData
  }
  txData.recipient = tx.recipient

  return txData
}
