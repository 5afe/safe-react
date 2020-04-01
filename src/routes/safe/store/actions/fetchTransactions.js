// @flow
import axios from 'axios'
import bn from 'bignumber.js'
import { List, Map, type RecordInstance } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import { addIncomingTransactions } from './addIncomingTransactions'
import { addTransactions } from './addTransactions'

import { decodeParamsFromSafeMethod } from '~/logic/contracts/methodIds'
import { buildIncomingTxServiceUrl } from '~/logic/safe/transactions/incomingTxHistory'
import { type TxServiceType, buildTxServiceUrl } from '~/logic/safe/transactions/txHistory'
import { getLocalSafe } from '~/logic/safe/utils'
import { getTokenInfos } from '~/logic/tokens/store/actions/fetchTokens'
import { ALTERNATIVE_TOKEN_ABI } from '~/logic/tokens/utils/alternativeAbi'
import {
  DECIMALS_METHOD_HASH,
  SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH,
  isMultisendTransaction,
  isTokenTransfer,
  isUpgradeTransaction,
} from '~/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS, sameAddress } from '~/logic/wallets/ethAddresses'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { addCancellationTransactions } from '~/routes/safe/store/actions/addCancellationTransactions'
import { makeConfirmation } from '~/routes/safe/store/models/confirmation'
import { type IncomingTransaction, makeIncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { makeOwner } from '~/routes/safe/store/models/owner'
import type { TransactionProps } from '~/routes/safe/store/models/transaction'
import { type Transaction, makeTransaction } from '~/routes/safe/store/models/transaction'
import { type GlobalState } from '~/store'

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
  data: ?string,
  operation: number,
  nonce: ?number,
  blockNumber: ?number,
  safeTxGas: number,
  baseGas: number,
  gasPrice: number,
  gasToken: string,
  refundReceiver: string,
  safeTxHash: string,
  submissionDate: ?string,
  executor: string,
  executionDate: ?string,
  confirmations: ConfirmationServiceModel[],
  isExecuted: boolean,
  isSuccessful: boolean,
  transactionHash: ?string,
  creationTx?: boolean,
}

type IncomingTxServiceModel = {
  blockNumber: number,
  transactionHash: string,
  to: string,
  value: number,
  tokenAddress: string,
  from: string,
}

export const buildTransactionFrom = async (safeAddress: string, tx: TxServiceModel): Promise<Transaction> => {
  const { owners } = await getLocalSafe(safeAddress)

  const confirmations = List(
    tx.confirmations.map((conf: ConfirmationServiceModel) => {
      let ownerName = 'UNKNOWN'

      if (owners) {
        const storedOwner = owners.find((owner) => sameAddress(conf.owner, owner.address))

        if (storedOwner) {
          ownerName = storedOwner.name
        }
      }

      return makeConfirmation({
        owner: makeOwner({ address: conf.owner, name: ownerName }),
        type: ((conf.confirmationType.toLowerCase(): any): TxServiceType),
        hash: conf.transactionHash,
        signature: conf.signature,
      })
    }),
  )
  const modifySettingsTx = sameAddress(tx.to, safeAddress) && Number(tx.value) === 0 && !!tx.data
  const cancellationTx = sameAddress(tx.to, safeAddress) && Number(tx.value) === 0 && !tx.data
  const code = tx.to ? await web3.eth.getCode(tx.to) : ''
  const isERC721Token =
    code.includes(SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH) ||
    (isTokenTransfer(tx.data, Number(tx.value)) && !code.includes(DECIMALS_METHOD_HASH))
  const isSendTokenTx = !isERC721Token && isTokenTransfer(tx.data, Number(tx.value))
  const isMultiSendTx = isMultisendTransaction(tx.data, Number(tx.value))
  const isUpgradeTx = isMultiSendTx && isUpgradeTransaction(tx.data)
  const customTx = !sameAddress(tx.to, safeAddress) && !!tx.data && !isSendTokenTx && !isUpgradeTx && !isERC721Token

  let refundParams = null
  if (tx.gasPrice > 0) {
    let refundSymbol = 'ETH'
    let decimals = 18
    if (tx.gasToken !== ZERO_ADDRESS) {
      const gasToken = await getTokenInfos(tx.gasToken)
      refundSymbol = gasToken.symbol
      decimals = gasToken.decimals
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
    const tokenInstance = await getTokenInfos(tx.to)
    try {
      symbol = tokenInstance.symbol
      decimals = tokenInstance.decimals
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
    gasToken: tx.gasToken || ZERO_ADDRESS,
    refundReceiver: tx.refundReceiver || ZERO_ADDRESS,
    refundParams,
    isExecuted: tx.isExecuted,
    isSuccessful: tx.isSuccessful,
    submissionDate: tx.submissionDate,
    executor: tx.executor,
    executionDate: tx.executionDate,
    executionTxHash: tx.transactionHash,
    safeTxHash: tx.safeTxHash,
    isTokenTransfer: isSendTokenTx,
    multiSendTx: isMultiSendTx,
    upgradeTx: isUpgradeTx,
    decodedParams,
    modifySettingsTx,
    customTx,
    cancellationTx,
    creationTx: tx.creationTx,
    origin: tx.origin,
  })
}

const addMockSafeCreationTx = (safeAddress): Array<TxServiceModel> => [
  {
    blockNumber: null,
    baseGas: 0,
    confirmations: [],
    data: null,
    executionDate: null,
    gasPrice: 0,
    gasToken: '0x0000000000000000000000000000000000000000',
    isExecuted: true,
    nonce: null,
    operation: 0,
    refundReceiver: '0x0000000000000000000000000000000000000000',
    safe: safeAddress,
    safeTxGas: 0,
    safeTxHash: '',
    signatures: null,
    submissionDate: null,
    executor: '',
    to: '',
    transactionHash: null,
    value: 0,
    creationTx: true,
  },
]

export const buildIncomingTransactionFrom = async (tx: IncomingTxServiceModel) => {
  let symbol = 'ETH'
  let decimals = 18

  const fee = await web3.eth
    .getTransaction(tx.transactionHash)
    .then(({ gas, gasPrice }) => bn(gas).div(gasPrice).toFixed())

  if (tx.tokenAddress) {
    try {
      const tokenInstance = await getTokenInfos(tx.tokenAddress)
      symbol = tokenInstance.symbol
      decimals = tokenInstance.decimals
    } catch (err) {
      try {
        const { methods } = new web3.eth.Contract(ALTERNATIVE_TOKEN_ABI, tx.tokenAddress)
        const [tokenSymbol, tokenDecimals] = await Promise.all(
          [methods.symbol, methods.decimals].map((m) => m().call()),
        )
        symbol = web3.utils.hexToString(tokenSymbol)
        decimals = tokenDecimals
      } catch (e) {
        // this is a particular treatment for the DCD token, as it seems to lack of symbol and decimal methods
        if (tx.tokenAddress && tx.tokenAddress.toLowerCase() === '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a') {
          symbol = 'DCD'
          decimals = 9
        }
        // if it's not DCD, then we fall to the default values
      }
    }
  }

  const { transactionHash, ...incomingTx } = tx

  return makeIncomingTransaction({
    ...incomingTx,
    symbol,
    decimals,
    fee,
    executionTxHash: transactionHash,
    safeTxHash: transactionHash,
  })
}

export type SafeTransactionsType = {
  outgoing: Map<string, List<TransactionProps>>,
  cancel: Map<string, List<TransactionProps>>,
}

let etagSafeTransactions = null
let etagCachedSafeIncommingTransactions = null
export const loadSafeTransactions = async (safeAddress: string): Promise<SafeTransactionsType> => {
  let transactions: TxServiceModel[] = addMockSafeCreationTx(safeAddress)

  try {
    const config = etagSafeTransactions
      ? {
          headers: {
            'If-None-Match': etagSafeTransactions,
          },
        }
      : undefined

    const url = buildTxServiceUrl(safeAddress)
    const response = await axios.get(url, config)
    if (response.data.count > 0) {
      transactions = transactions.concat(response.data.results)
      if (etagSafeTransactions === response.headers.etag) {
        // The txs are the same, we can return the cached ones
        return
      }
      etagSafeTransactions = response.headers.etag
    }
  } catch (err) {
    if (err && err.response && err.response.status === 304) {
      // NOTE: this is the expected implementation, currently the backend is not returning 304.
      // So I check if the returned etag is the same instead (see above)
      return
    } else {
      console.error(`Requests for outgoing transactions for ${safeAddress} failed with 404`, err)
    }
  }

  // In case that the etags don't match, we parse the new transactions and save them to the cache
  const txsRecord: Array<RecordInstance<TransactionProps>> = await Promise.all(
    transactions.map((tx: TxServiceModel) => buildTransactionFrom(safeAddress, tx)),
  )

  const groupedTxs = List(txsRecord).groupBy((tx) => (tx.get('cancellationTx') ? 'cancel' : 'outgoing'))

  return {
    outgoing: Map().set(safeAddress, groupedTxs.get('outgoing')),
    cancel: Map().set(safeAddress, groupedTxs.get('cancel')),
  }
}

export const loadSafeIncomingTransactions = async (safeAddress: string) => {
  let incomingTransactions: IncomingTxServiceModel[] = []
  try {
    const config = etagCachedSafeIncommingTransactions
      ? {
          headers: {
            'If-None-Match': etagCachedSafeIncommingTransactions,
          },
        }
      : undefined
    const url = buildIncomingTxServiceUrl(safeAddress)
    const response = await axios.get(url, config)
    if (response.data.count > 0) {
      incomingTransactions = response.data.results
      if (etagCachedSafeIncommingTransactions === response.headers.etag) {
        // The txs are the same, we can return the cached ones
        return
      }
      etagCachedSafeIncommingTransactions = response.headers.etag
    }
  } catch (err) {
    if (err && err.response && err.response.status === 304) {
      // We return cached transactions
      return
    } else {
      console.error(`Requests for incoming transactions for ${safeAddress} failed with 404`, err)
    }
  }

  const incomingTxsRecord = await Promise.all(incomingTransactions.map(buildIncomingTransactionFrom))
  return Map().set(safeAddress, List(incomingTxsRecord))
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  web3 = await getWeb3()

  const transactions: SafeTransactionsType | undefined = await loadSafeTransactions(safeAddress)
  if (transactions) {
    const { cancel, outgoing } = transactions
    dispatch(addCancellationTransactions(cancel))
    dispatch(addTransactions(outgoing))
  }
  const incomingTransactions: Map<string, List<IncomingTransaction>> | undefined = await loadSafeIncomingTransactions(
    safeAddress,
  )

  if (incomingTransactions) {
    dispatch(addIncomingTransactions(incomingTransactions))
  }
}
