// @flow
import axios from 'axios'

import { buildTxServiceUrl } from '~/logic/safe/transactions/txHistory'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'

export const getLastTx = async (safeAddress: string): Promise<TransactionProps> => {
  try {
    const url = buildTxServiceUrl(safeAddress)
    const response = await axios.get(url, { params: { limit: 1 } })

    return response.data.results[0]
  } catch (e) {
    console.error('failed to retrieve last Tx from server', e)
    return null
  }
}

export const getSafeNonce = async (safeAddress: string): Promise<string> => {
  // use current's safe nonce as fallback
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  return (await safeInstance.nonce()).toString()
}

export const getNewTxNonce = async (txNonce, lastTx, safeAddress) => {
  if (!Number.isInteger(Number.parseInt(txNonce, 10))) {
    return lastTx === null ? getSafeNonce(safeAddress) : `${lastTx.nonce + 1}`
  }
  return txNonce
}

export const doesTxNeedApproval = async (safeInstance, nonce, lastTx) => {
  const threshold = await safeInstance.getThreshold()

  // if treshold is grater than one, it always needs approval
  if (threshold.toNumber() > 1) {
    return true
  }

  // if treshold is 1, and is the first TX, it does not need approval
  if (!Number.parseInt(nonce) === 0) {
    return false
  }

  // if threshold is 1, but the previous tx is not executed, it's delayed
  // using the approval mechanisims, once the previous tx is executed, the
  // current tx will be abailable to be executed by the user using the exec button.
  if (lastTx && !lastTx.isExecuted) {
    return false
  }
}
