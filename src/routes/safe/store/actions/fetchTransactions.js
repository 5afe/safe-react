// @flow
import { List, Map } from 'immutable'
import axios from 'axios'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/models/owner'
import { makeTransaction, type Transaction } from '~/routes/safe/store/models/transaction'
import { makeIncomingTransaction, type IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { makeConfirmation } from '~/routes/safe/store/models/confirmation'
import { loadSafeSubjects } from '~/utils/storage/transactions'
import { buildTxServiceUrl, type TxServiceType } from '~/logic/safe/transactions/txHistory'
import { buildIncomingTxServiceUrl } from '~/logic/safe/transactions/incomingTxHistory'
import { getOwners } from '~/logic/safe/utils'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { addTransactions } from './addTransactions'
import { addIncomingTransactions } from './addIncomingTransactions'
import { getHumanFriendlyToken } from '~/logic/tokens/store/actions/fetchTokens'
import { isTokenTransfer } from '~/logic/tokens/utils/tokenHelpers'
import { decodeParamsFromSafeMethod } from '~/logic/contracts/methodIds'
import { ALTERNATIVE_TOKEN_ABI } from '~/logic/tokens/utils/alternativeAbi'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'

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
  blockNumber: number,
  safeTxGas: number,
  baseGas: number,
  gasPrice: number,
  gasToken: string,
  refundReceiver: string,
  safeTxHash: string,
  submissionDate: string,
  executionDate: string,
  confirmations: ConfirmationServiceModel[],
  isExecuted: boolean,
  transactionHash: string,
}

type IncomingTxServiceModel = {
  blockNumber: number,
  transactionHash: string,
  to: string,
  value: number,
  tokenAddress: string,
  from: string,
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
        signature: conf.signature,
      })
    }),
  )
  const modifySettingsTx = tx.to === safeAddress && Number(tx.value) === 0 && !!tx.data
  const cancellationTx = tx.to === safeAddress && Number(tx.value) === 0 && !tx.data
  const isSendTokenTx = await isTokenTransfer(tx.data, tx.value)
  const customTx = tx.to !== safeAddress && !!tx.data && !isSendTokenTx

  let refundParams = null
  if (tx.gasPrice > 0) {
    let refundSymbol = 'ETH'
    let decimals = 18
    if (tx.gasToken !== ZERO_ADDRESS) {
      const gasToken = await (await getHumanFriendlyToken()).at(tx.gasToken)
      refundSymbol = await gasToken.symbol()
      decimals = await gasToken.decimals()
    }

    const feeString = (tx.gasPrice * (tx.baseGas + tx.safeTxGas)).toString().padStart(decimals, 0)
    const whole = feeString.slice(0, feeString.length - decimals) || '0'
    const fraction = feeString.slice(feeString.length - decimals)

    const formattedFee = `${whole}.${fraction}`
    refundParams = {
      fee: formattedFee,
      symbol: refundSymbol,
    }
  }

  let symbol = 'ETH'
  let decimals = 18
  let decodedParams
  if (isSendTokenTx) {
    const tokenContract = await getHumanFriendlyToken()
    const tokenInstance = await tokenContract.at(tx.to)
    try {
      [symbol, decimals] = await Promise.all([tokenInstance.symbol(), tokenInstance.decimals()])
    } catch (err) {
      const alternativeTokenInstance = new web3.eth.Contract(ALTERNATIVE_TOKEN_ABI, tx.to)
      const [tokenSymbol, tokenDecimals] = await Promise.all([
        alternativeTokenInstance.methods.symbol().call(),
        alternativeTokenInstance.methods.decimals().call(),
      ])

      symbol = web3.utils.toAscii(tokenSymbol)
      decimals = tokenDecimals
    }

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
    blockNumber: tx.blockNumber,
    value: tx.value.toString(),
    confirmations,
    decimals,
    recipient: tx.to,
    data: tx.data ? tx.data : EMPTY_DATA,
    operation: tx.operation,
    safeTxGas: tx.safeTxGas,
    baseGas: tx.baseGas,
    gasPrice: tx.gasPrice,
    gasToken: tx.gasToken,
    refundReceiver: tx.refundReceiver,
    refundParams,
    isExecuted: tx.isExecuted,
    submissionDate: tx.submissionDate,
    executionDate: tx.executionDate,
    executionTxHash: tx.transactionHash,
    safeTxHash: tx.safeTxHash,
    isTokenTransfer: isSendTokenTx,
    decodedParams,
    modifySettingsTx,
    customTx,
    cancellationTx,
  })
}

export const buildIncomingTransactionFrom = async (tx: IncomingTxServiceModel) => makeIncomingTransaction(tx)

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

export const loadSafeIncomingTransactions = async (safeAddress: string) => {
  const url = buildIncomingTxServiceUrl(safeAddress)
  const response = await axios.get(url)
  const incomingTransactions: IncomingTxServiceModel[] = response.data.results
  const incomingTxsRecord = await Promise.all(incomingTransactions.map(buildIncomingTransactionFrom))

  return Map().set(safeAddress, List(incomingTxsRecord))
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const transactions: Map<string, List<Transaction>> = await loadSafeTransactions(safeAddress)
    const incomingTransactions: Map<string, List<IncomingTransaction>> = await loadSafeIncomingTransactions(safeAddress)

    dispatch(addTransactions(transactions))
    dispatch(addIncomingTransactions(incomingTransactions))
  } catch (err) {
    console.error(`Requests for transactions for ${safeAddress} failed with 404`)
  }
}
