import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { TxServiceModel } from './transactions/fetchTransactions/loadOutgoingTransactions'
import axios from 'axios'

import { buildTxServiceUrl } from 'src/logic/safe/transactions/txHistory'

export const getLastTx = async (safeAddress: string): Promise<TxServiceModel | null> => {
  try {
    const url = buildTxServiceUrl(safeAddress)
    const response = await axios.get(url, { params: { limit: 1 } })

    return response.data.results[0] || null
  } catch (e) {
    console.error('failed to retrieve last Tx from server', e)
    return null
  }
}

export const getNewTxNonce = async (lastTx: TxServiceModel | null, safeInstance: GnosisSafe): Promise<string> => {
  // use current's safe nonce as fallback
  return lastTx ? `${lastTx.nonce + 1}` : (await safeInstance.methods.nonce().call()).toString()
}

export const shouldExecuteTransaction = async (
  safeInstance: GnosisSafe,
  nonce: string,
  lastTx: TxServiceModel | null,
): Promise<boolean> => {
  const safeNonce = (await safeInstance.methods.nonce().call()).toString()
  const thresholdAsString = await safeInstance.methods.getThreshold().call()
  const threshold = Number(thresholdAsString)

  // Needs to collect owners signatures
  if (threshold > 1) {
    return false
  }

  // Allow first tx.
  if (Number(nonce) === 0) {
    return true
  }

  // Allow if nonce === safeNonce and threshold === 1
  if (nonce === safeNonce) {
    return true
  }

  // If the previous tx is not executed or the different between lastTx.nonce and nonce is > 1
  // it's delayed using the approval mechanisms.
  // Once the previous tx is executed, the current tx will be available to be executed
  // by the user using the exec button.
  if (lastTx) {
    return lastTx.isExecuted && lastTx.nonce + 1 === Number(nonce)
  }

  return false
}
