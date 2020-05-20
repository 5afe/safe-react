import { SAFE_METHODS_NAMES } from 'src/logic/contracts/methodIds'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

const getSafeVersion = (data) => {
  const contractAddress = data.substr(340, 40).toLowerCase()

  return (
    {
      '34cfac646f301356faa8b21e94227e3583fe3f5f': '1.1.1',
    }[contractAddress] || 'X.x.x'
  )
}

export const getTxData = (tx) => {
  const web3 = getWeb3()
  const { fromWei, toBN } = web3.utils

  const txData: any = {}

  if (tx.isTokenTransfer && tx.decodedParams) {
    txData.recipient = tx.decodedParams.recipient
    txData.value = fromWei(toBN(tx.decodedParams.value), 'ether')
  } else if (tx.customTx) {
    txData.recipient = tx.recipient
    txData.value = fromWei(toBN(tx.value), 'ether')
    txData.data = tx.data
    txData.customTx = true
  } else if (Number(tx.value) > 0) {
    txData.recipient = tx.recipient
    txData.value = fromWei(toBN(tx.value), 'ether')
  } else if (tx.modifySettingsTx) {
    txData.recipient = tx.recipient
    txData.modifySettingsTx = true

    if (tx.decodedParams) {
      txData.action = tx.decodedParams.methodName

      if (txData.action === SAFE_METHODS_NAMES.REMOVE_OWNER) {
        txData.removedOwner = tx.decodedParams.args[1]
        txData.newThreshold = tx.decodedParams.args[2]
      } else if (txData.action === SAFE_METHODS_NAMES.CHANGE_THRESHOLD) {
        txData.newThreshold = tx.decodedParams.args[0]
      } else if (txData.action === SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD) {
        txData.addedOwner = tx.decodedParams.args[0]
        txData.newThreshold = tx.decodedParams.args[1]
      } else if (txData.action === SAFE_METHODS_NAMES.SWAP_OWNER) {
        txData.removedOwner = tx.decodedParams.args[1]
        txData.addedOwner = tx.decodedParams.args[2]
      }
    }
  } else if (tx.cancellationTx) {
    txData.cancellationTx = true
  } else if (tx.creationTx) {
    txData.creationTx = true
  } else if (tx.upgradeTx) {
    txData.upgradeTx = true
    txData.data = `The contract of this Safe is upgraded to Version ${getSafeVersion(tx.data)}`
  } else {
    txData.recipient = tx.recipient
    txData.value = 0
  }

  return txData
}
