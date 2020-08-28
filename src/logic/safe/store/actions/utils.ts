import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { TxServiceModel } from './transactions/fetchTransactions/loadOutgoingTransactions'
import axios from 'axios'

import { buildTxServiceUrl } from 'src/logic/safe/transactions/txHistory'

export const getLastTx = async (safeAddress: string): Promise<TxServiceModel> => {
  try {
    const url = buildTxServiceUrl(safeAddress)
    const response = await axios.get(url, { params: { limit: 1 } })

    return response.data.results[0] || null
  } catch (e) {
    console.error('failed to retrieve last Tx from server', e)
    return null
  }
}

export const getNewTxNonce = async (
  txNonce: string | undefined,
  lastTx: TxServiceModel,
  safeInstance: GnosisSafe,
): Promise<string> => {
  if (typeof txNonce === 'string' && !Number.isInteger(Number.parseInt(txNonce, 10))) {
    return lastTx === null
      ? // use current's safe nonce as fallback
        (await safeInstance.methods.nonce().call()).toString()
      : `${lastTx.nonce + 1}`
  }

  return txNonce as string
}

export const shouldExecuteTransaction = async (
  safeInstance: GnosisSafe,
  nonce: string,
  lastTx: TxServiceModel,
): Promise<boolean> => {
  const threshold = await safeInstance.methods.getThreshold().call()

  // Tx will automatically be executed if and only if the threshold is 1
  if (Number.parseInt(threshold) === 1) {
    const isFirstTransaction = Number.parseInt(nonce) === 0
    // if the previous tx is not executed, it's delayed using the approval mechanisms,
    // once the previous tx is executed, the current tx will be available to be executed
    // by the user using the exec button.
    const canExecuteCurrentTransaction = lastTx && lastTx.isExecuted

    return isFirstTransaction || canExecuteCurrentTransaction
  }

  return false
}
