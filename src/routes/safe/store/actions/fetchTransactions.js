// @flow
import { List, Map } from 'immutable'
import axios from 'axios'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/models/owner'
import { makeTransaction, type Transaction } from '~/routes/safe/store/models/transaction'
import { makeConfirmation } from '~/routes/safe/store/models/confirmation'
import { loadSafeSubjects } from '~/utils/storage/transactions'
import { buildTxServiceUrl, type TxServiceType } from '~/logic/safe/transactions/txHistory'
import { getOwners } from '~/logic/safe/utils'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { addTransactions } from './addTransactions'
import { getHumanFriendlyToken } from '~/logic/tokens/store/actions/fetchTokens'
import { isTokenTransfer } from '~/logic/tokens/utils/tokenHelpers'
import { TX_TYPE_EXECUTION } from '~/logic/safe/transactions/send'
import { decodeParamsFromSafeMethod } from '~/logic/contracts/methodIds'

let web3

type ConfirmationServiceModel = {
  owner: string,
  submissionDate: Date,
  confirmationType: string,
  transactionHash: string,
}

type TxServiceModel = {
  to: string,
  value: number,
  data: string,
  operation: number,
  nonce: number,
  safeTxHash: string,
  submissionDate: string,
  executionDate: string,
  confirmations: ConfirmationServiceModel[],
  isExecuted: boolean,
}

export const buildTransactionFrom = async (
  safeAddress: string,
  tx: TxServiceModel,
  safeSubjects: Map<string, string>,
) => {
  const name = safeSubjects.get(String(tx.nonce)) || 'Unknown'
  const storedOwners = await getOwners(safeAddress)
  const confirmations = List(
    tx.confirmations.map((conf: ConfirmationServiceModel) => {
      const ownerName = storedOwners.get(conf.owner.toLowerCase()) || 'UNKNOWN'

      return makeConfirmation({
        owner: makeOwner({ address: conf.owner, name: ownerName }),
        type: ((conf.confirmationType.toLowerCase(): any): TxServiceType),
        hash: conf.transactionHash,
      })
    }),
  )
  const modifySettingsTx = tx.to === safeAddress && Number(tx.value) === 0 && !!tx.data
  const cancellationTx = tx.to === safeAddress && Number(tx.value) === 0 && !tx.data
  const customTx = tx.to !== safeAddress && !!tx.data
  const isSendTokenTx = await isTokenTransfer(tx.data, tx.value)

  let executionTxHash
  const executionTx = confirmations.find((conf) => conf.type === TX_TYPE_EXECUTION)

  if (executionTx) {
    executionTxHash = executionTx.hash
  }

  let symbol = 'ETH'
  let decodedParams
  if (isSendTokenTx) {
    const tokenContract = await getHumanFriendlyToken()
    const tokenInstance = await tokenContract.at(tx.to)
    symbol = await tokenInstance.symbol()

    const params = web3.eth.abi.decodeParameters(['address', 'uint256'], tx.data.slice(10))
    decodedParams = {
      recipient: params[0],
      value: params[1],
    }
  } else if (modifySettingsTx && tx.data) {
    decodedParams = await decodeParamsFromSafeMethod(tx.data)
  } else if (customTx && tx.data) {
    decodedParams = await decodeParamsFromSafeMethod(tx.data)
  }

  return makeTransaction({
    name,
    symbol,
    nonce: tx.nonce,
    value: tx.value.toString(),
    confirmations,
    recipient: tx.to,
    data: tx.data ? tx.data : EMPTY_DATA,
    isExecuted: tx.isExecuted,
    submissionDate: tx.submissionDate,
    executionDate: tx.executionDate,
    executionTxHash,
    safeTxHash: tx.safeTxHash,
    isTokenTransfer: isSendTokenTx,
    decodedParams,
    modifySettingsTx,
    customTx,
    cancellationTx,
  })
}

export const loadSafeTransactions = async (safeAddress: string) => {
  web3 = await getWeb3()

  const url = buildTxServiceUrl(safeAddress)
  const response = await axios.get(url)
  const transactions: TxServiceModel[] = response.data.results
  const safeSubjects = loadSafeSubjects(safeAddress)
  const txsRecord = await Promise.all(
    transactions.map((tx: TxServiceModel) => buildTransactionFrom(safeAddress, tx, safeSubjects)),
  )

  return Map().set(safeAddress, List(txsRecord))
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const transactions: Map<string, List<Transaction>> = await loadSafeTransactions(safeAddress)

  return dispatch(addTransactions(transactions))
}
