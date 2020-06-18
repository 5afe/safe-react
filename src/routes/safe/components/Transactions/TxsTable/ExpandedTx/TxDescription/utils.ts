import { SAFE_METHODS_NAMES } from 'src/logic/contracts/methodIds'

const getSafeVersion = (data) => {
  const contractAddress = data.substr(340, 40).toLowerCase()

  return (
    {
      '34cfac646f301356faa8b21e94227e3583fe3f5f': '1.1.1',
    }[contractAddress] || 'X.x.x'
  )
}

export const getTxData = (tx) => {
  const txData: any = {}

  if (tx.decodedParams) {
    if (tx.isTokenTransfer) {
      const { to } = tx.decodedParams.transfer
      txData.recipient = to
      txData.isTokenTransfer = true
    }
    if (tx.isCollectibleTransfer) {
      const { safeTransferFrom, transfer, transferFrom } = tx.decodedParams
      const { to, value } = safeTransferFrom || transferFrom || transfer
      txData.recipient = to
      txData.tokenId = value
      txData.isCollectibleTransfer = true
    }
    if (tx.modifySettingsTx) {
      txData.recipient = tx.recipient
      txData.modifySettingsTx = true

      if (tx.decodedParams[SAFE_METHODS_NAMES.REMOVE_OWNER]) {
        const { _threshold, owner } = tx.decodedParams[SAFE_METHODS_NAMES.REMOVE_OWNER]
        txData.action = SAFE_METHODS_NAMES.REMOVE_OWNER
        txData.removedOwner = owner
        txData.newThreshold = _threshold
      } else if (tx.decodedParams[SAFE_METHODS_NAMES.CHANGE_THRESHOLD]) {
        const { _threshold } = tx.decodedParams[SAFE_METHODS_NAMES.CHANGE_THRESHOLD]
        txData.action = SAFE_METHODS_NAMES.CHANGE_THRESHOLD
        txData.newThreshold = _threshold
      } else if (tx.decodedParams[SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD]) {
        const { _threshold, owner } = tx.decodedParams[SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD]
        txData.action = SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD
        txData.addedOwner = owner
        txData.newThreshold = _threshold
      } else if (tx.decodedParams[SAFE_METHODS_NAMES.SWAP_OWNER]) {
        const { newOwner, oldOwner } = tx.decodedParams[SAFE_METHODS_NAMES.SWAP_OWNER]
        txData.action = SAFE_METHODS_NAMES.SWAP_OWNER
        txData.removedOwner = oldOwner
        txData.addedOwner = newOwner
      }
    }
    if (tx.multiSendTx) {
      txData.recipient = tx.recipient
      txData.data = tx.data
      txData.customTx = true
    }
  } else if (tx.customTx) {
    txData.recipient = tx.recipient
    txData.data = tx.data
    txData.customTx = true
  } else if (Number(tx.value) > 0) {
    txData.recipient = tx.recipient
  } else if (tx.isCancellationTx) {
    txData.cancellationTx = true
  } else if (tx.creationTx) {
    txData.creationTx = true
  } else if (tx.upgradeTx) {
    txData.upgradeTx = true
    txData.data = `The contract of this Safe is upgraded to Version ${getSafeVersion(tx.data)}`
  } else {
    txData.recipient = tx.recipient
  }

  return txData
}
