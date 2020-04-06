// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type Transaction } from '~/routes/safe/store/models/transaction'

type DecodedTxData = {
  action?: string,
  recipient: string,
  value?: string,
  modifySettingsTx?: boolean,
  removedOwner?: string,
  newThreshold?: string,
  addedOwner?: string,
  cancellationTx?: boolean,
  customTx?: boolean,
  creationTx?: boolean,
  data: string,
  upgradeTx: boolean,
}

const getSafeVersion = (data: string) => {
  const contractAddress = data.substr(340, 40).toLowerCase()

  return (
    {
      '34cfac646f301356faa8b21e94227e3583fe3f5f': '1.1.1',
    }[contractAddress] || 'X.x.x'
  )
}

export const getTxData = (tx: Transaction): DecodedTxData => {
  const web3 = getWeb3()
  const { fromWei, toBN } = web3.utils

  const txData = {}

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

      if (txData.action === 'removeOwner') {
        txData.removedOwner = tx.decodedParams.args[1]
        txData.newThreshold = tx.decodedParams.args[2]
      } else if (txData.action === 'changeThreshold') {
        txData.newThreshold = tx.decodedParams.args[0]
      } else if (txData.action === 'addOwnerWithThreshold') {
        txData.addedOwner = tx.decodedParams.args[0]
        txData.newThreshold = tx.decodedParams.args[1]
      } else if (txData.action === 'swapOwner') {
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
