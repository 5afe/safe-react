// @flow
import axios from 'axios'
import { List } from 'immutable'
import { buildSafeCreationTxUrl } from '../../../../config'
import { addOrUpdateTransactions } from './transactions/addOrUpdateTransactions'
import { makeTransaction } from '../models/transaction'

const getCreationTx = async (safeAddress) => {
  const url = buildSafeCreationTxUrl(safeAddress)
  const response = await axios.get(url)
  return {
    ...response.data,
    creationTx: true,
    nonce: null,
  }
}

const fetchSafeCreationTx = (safeAddress) => async (dispatch) => {
  if (!safeAddress) return
  const creationTxFetched = await getCreationTx(safeAddress)

  const {
    created,
    creationTx,
    creator,
    factoryAddress,
    masterCopy,
    setupData,
    transactionHash,
    type,
  } = creationTxFetched
  const txType = type || 'creation'

  const creationTxAsRecord = makeTransaction({
    created,
    creator,
    factoryAddress,
    masterCopy,
    setupData,
    creationTx,
    executionTxHash: transactionHash,
    type: txType,
    submissionDate: created,
  })

  dispatch(addOrUpdateTransactions({ safeAddress, transactions: List([creationTxAsRecord]) }))
}

export default fetchSafeCreationTx
