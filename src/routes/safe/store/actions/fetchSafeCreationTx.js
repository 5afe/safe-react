// @flow
import axios from 'axios'
import { List } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import { buildSafeCreationTxUrl } from '~/config'
import { addOrUpdateTransactions } from '~/routes/safe/store/actions/transactions/addOrUpdateTransactions'
import { makeTransaction } from '~/routes/safe/store/models/transaction'
import { type GlobalState } from '~/store'

type CreationTxServiceModel = {
  created: string,
  creator: string,
  factoryAddress: string,
  masterCopy: string,
  setupData: string,
  transactionHash: string,
}

const getCreationTx = async (safeAddress): CreationTxServiceModel => {
  const url = buildSafeCreationTxUrl(safeAddress)
  const response = await axios.get(url)
  return {
    ...response.data,
    creationTx: true,
    nonce: null,
  }
}

const fetchSafeCreationTx = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
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
  })

  dispatch(addOrUpdateTransactions({ safeAddress, transactions: List([creationTxAsRecord]) }))
}

export default fetchSafeCreationTx
