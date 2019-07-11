// @flow
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { getWeb3 } from '~/logic/wallets/getWeb3'

const web3 = getWeb3()
const { toBN, fromWei } = web3.utils

type DecodedTxData = {
  recipient: string,
  value?: string,
  modifySettingsTx?: boolean,
  removedOwner?: string,
  newThreshold?: string,
  addedOwner?: string,
}

export const getTxData = (tx: Transaction): DecodedTxData => {
  const txData = {}

  if (tx.isTokenTransfer && tx.decodedParams) {
    txData.recipient = tx.decodedParams.recipient
    txData.value = fromWei(toBN(tx.decodedParams.value), 'ether')
  } else if (Number(tx.value) > 0) {
    txData.recipient = tx.recipient
    txData.value = fromWei(toBN(tx.value), 'ether')
  } else if (tx.modifySettingsTx) {
    txData.recipient = tx.recipient
    txData.modifySettingsTx = true

    if (tx.decodedParams) {
      /* eslint-disable */
      if (tx.decodedParams.methodName === 'removeOwner') {
        txData.removedOwner = tx.decodedParams.args[1]
        txData.newThreshold = tx.decodedParams.args[2]
      } else if (tx.decodedParams.methodName === 'changeThreshold') {
        txData.newThreshold = tx.decodedParams.args[0]
      } else if (tx.decodedParams.methodName === 'addOWnerWithThreshold') {
        txData.addedOwner = tx.decodedParams.args[1]
        txData.newThreshold = tx.decodedParams.args[1]
      } else if (tx.decodedParams.methodName === 'swapOwner') {
        txData.addedOwner = tx.decodedParams.args[0]
        txData.removedOwner = tx.decodedParams.args[1]
        txData.newThreshold = tx.decodedParams.args[2]
      }
      /* eslint-enable */
    }
  }

  return txData
}
