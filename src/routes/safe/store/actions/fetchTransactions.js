// @flow
import { List, Map, type RecordInstance } from 'immutable'
import axios from 'axios'
import bn from 'bignumber.js'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store'
import { makeOwner } from '~/routes/safe/store/models/owner'
import { makeTransaction, type Transaction } from '~/routes/safe/store/models/transaction'
import { makeIncomingTransaction, type IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { makeConfirmation } from '~/routes/safe/store/models/confirmation'
import { buildTxServiceUrl, type TxServiceType } from '~/logic/safe/transactions/txHistory'
import { buildIncomingTxServiceUrl } from '~/logic/safe/transactions/incomingTxHistory'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { sameAddress, ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getLocalSafe } from '~/logic/safe/utils'
import { addTransactions } from './addTransactions'
import { addIncomingTransactions } from './addIncomingTransactions'
import { getHumanFriendlyToken } from '~/logic/tokens/store/actions/fetchTokens'
import { isMultisendTransaction, isTokenTransfer, isUpgradeTransaction } from '~/logic/tokens/utils/tokenHelpers'
import { decodeParamsFromSafeMethod } from '~/logic/contracts/methodIds'
import { ALTERNATIVE_TOKEN_ABI } from '~/logic/tokens/utils/alternativeAbi'
import type { TransactionProps } from '~/routes/safe/store/models/transaction'
import { addCancellationTransactions } from '~/routes/safe/store/actions/addCancellationTransactions'

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
        const storedOwner = owners.find(owner => sameAddress(conf.owner, owner.address))

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
  const isSendTokenTx = isTokenTransfer(tx.data, Number(tx.value))
  const isMultiSendTx = isMultisendTransaction(tx.data, Number(tx.value))
  const customTx = !sameAddress(tx.to, safeAddress) && !!tx.data && !isSendTokenTx && !isMultiSendTx
  const isUpgradeTx = isMultiSendTx && isUpgradeTransaction(tx.data)

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
      ;[symbol, decimals] = await Promise.all([tokenInstance.symbol(), tokenInstance.decimals()])
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
    gasToken: tx.gasToken,
    refundReceiver: tx.refundReceiver,
    refundParams,
    isExecuted: tx.isExecuted,
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

  const fee = await web3.eth.getTransaction(tx.transactionHash).then(({ gas, gasPrice }) =>
    bn(gas)
      .div(gasPrice)
      .toFixed(),
  )

  if (tx.tokenAddress) {
    try {
      const tokenContract = await getHumanFriendlyToken()
      const tokenInstance = await tokenContract.at(tx.tokenAddress)
      const [tokenSymbol, tokenDecimals] = await Promise.all([tokenInstance.symbol(), tokenInstance.decimals()])
      symbol = tokenSymbol
      decimals = tokenDecimals
    } catch (err) {
      try {
        const { methods } = new web3.eth.Contract(ALTERNATIVE_TOKEN_ABI, tx.tokenAddress)
        const [tokenSymbol, tokenDecimals] = await Promise.all([methods.symbol, methods.decimals].map(m => m().call()))
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

export const loadSafeTransactions = async (safeAddress: string): Promise<SafeTransactionsType> => {
  let transactions: TxServiceModel[] = addMockSafeCreationTx(safeAddress)

  try {
    const url = buildTxServiceUrl(safeAddress)
    const response = await axios.get(url)
    if (response.data.count > 0) {
      transactions = transactions.concat(response.data.results)
    }
  } catch (err) {
    console.error(`Requests for outgoing transactions for ${safeAddress} failed with 404`, err)
  }

  const txsRecord: Array<RecordInstance<TransactionProps>> = await Promise.all(
    transactions.map((tx: TxServiceModel) => buildTransactionFrom(safeAddress, tx)),
  )

  const groupedTxs = List(txsRecord).groupBy(tx => (tx.get('cancellationTx') ? 'cancel' : 'outgoing'))

  return {
    outgoing: Map().set(safeAddress, groupedTxs.get('outgoing')),
    cancel: Map().set(safeAddress, groupedTxs.get('cancel')),
  }
}

export const loadSafeIncomingTransactions = async (safeAddress: string) => {
  let incomingTransactions: IncomingTxServiceModel[] = []
  try {
    const url = buildIncomingTxServiceUrl(safeAddress)
    const response = await axios.get(url)
    if (response.data.count > 0) {
      incomingTransactions = response.data.results
    }
  } catch (err) {
    console.error(`Requests for incoming transactions for ${safeAddress} failed with 404`, err)
  }

  const incomingTxsRecord = await Promise.all(incomingTransactions.map(buildIncomingTransactionFrom))

  return Map().set(safeAddress, List(incomingTxsRecord))
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  web3 = await getWeb3()

  const { outgoing, cancel }: SafeTransactionsType = await loadSafeTransactions(safeAddress)
  const incomingTransactions: Map<string, List<IncomingTransaction>> = await loadSafeIncomingTransactions(safeAddress)
  dispatch(addCancellationTransactions(cancel))
  dispatch(addTransactions(outgoing))
  dispatch(addIncomingTransactions(incomingTransactions))
}
