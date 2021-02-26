import axios from 'axios'
import { List } from 'immutable'

import { buildSafeCreationTxUrl } from 'src/logic/safe/utils/buildSafeCreationTxUrl'
import { addOrUpdateTransactions } from './transactions/addOrUpdateTransactions'
import { makeTransaction } from 'src/logic/safe/store/models/transaction'
import { TransactionTypes, TransactionStatus } from 'src/logic/safe/store/models/types/transaction'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'

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
  const txType = type || TransactionTypes.CREATION
  const safeTxHash = web3ReadOnly.utils.toHex('this is the creation transaction')

  const creationTxAsRecord = makeTransaction({
    created,
    creator,
    factoryAddress,
    masterCopy,
    nonce: -1,
    setupData,
    creationTx,
    executionTxHash: transactionHash,
    type: txType,
    safeTxHash,
    status: TransactionStatus.SUCCESS,
    submissionDate: created,
  })

  dispatch(addOrUpdateTransactions({ safeAddress, transactions: List([creationTxAsRecord]) }))
}

export default fetchSafeCreationTx
