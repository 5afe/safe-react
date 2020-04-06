// 
import axios from 'axios'
import bn from 'bignumber.js'
import { List, Map, } from 'immutable'

import { addIncomingTransactions } from './addIncomingTransactions'
import { addTransactions } from './addTransactions'

import { decodeParamsFromSafeMethod } from 'src/logic/contracts/methodIds'
import { buildIncomingTxServiceUrl } from 'src/logic/safe/transactions/incomingTxHistory'
import { buildTxServiceUrl } from 'src/logic/safe/transactions/txHistory'
import { getLocalSafe } from 'src/logic/safe/utils'
import { getTokenInfos } from 'src/logic/tokens/store/actions/fetchTokens'
import { ALTERNATIVE_TOKEN_ABI } from 'src/logic/tokens/utils/alternativeAbi'
import {
  DECIMALS_METHOD_HASH,
  SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH,
  isMultisendTransaction,
  isTokenTransfer,
  isUpgradeTransaction,
} from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS, sameAddress } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { addCancellationTransactions } from 'src/routes/safe/store/actions/addCancellationTransactions'
import { makeConfirmation } from 'src/routes/safe/store/models/confirmation'
import { makeIncomingTransaction } from 'src/routes/safe/store/models/incomingTransaction'
import { makeOwner } from 'src/routes/safe/store/models/owner'
import { makeTransaction } from 'src/routes/safe/store/models/transaction'
import { } from 'src/store'

let web3




export const buildTransactionFrom = async (safeAddress, tx) => {
  const { owners } = await getLocalSafe(safeAddress)

  const confirmations = List(
    tx.confirmations.map((conf) => {
      let ownerName = 'UNKNOWN'

      if (owners) {
        const storedOwner = owners.find((owner) => sameAddress(conf.owner, owner.address))

        if (storedOwner) {
          ownerName = storedOwner.name
        }
      }

      return makeConfirmation({
        owner: makeOwner({ address: conf.owner, name: ownerName }),
        type: ((conf.confirmationType.toLowerCase())),
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
    gasToken: tx.gasToken,
    refundReceiver: tx.refundReceiver,
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

const addMockSafeCreationTx = (safeAddress) => [
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

export const buildIncomingTransactionFrom = async (tx) => {
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


let etagSafeTransactions = null
let etagCachedSafeIncommingTransactions = null
export const loadSafeTransactions = async (safeAddress) => {
  let transactions = addMockSafeCreationTx(safeAddress)

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
  const txsRecord = await Promise.all(
    transactions.map((tx) => buildTransactionFrom(safeAddress, tx)),
  )

  const groupedTxs = List(txsRecord).groupBy((tx) => (tx.get('cancellationTx') ? 'cancel' : 'outgoing'))

  return {
    outgoing: Map().set(safeAddress, groupedTxs.get('outgoing')),
    cancel: Map().set(safeAddress, groupedTxs.get('cancel')),
  }
}

export const loadSafeIncomingTransactions = async (safeAddress) => {
  let incomingTransactions = []
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

export default (safeAddress) => async (dispatch) => {
  web3 = await getWeb3()

  const transactions = await loadSafeTransactions(safeAddress)
  if (transactions) {
    const { cancel, outgoing } = transactions
    dispatch(addCancellationTransactions(cancel))
    dispatch(addTransactions(outgoing))
  }
  const incomingTransactions = await loadSafeIncomingTransactions(
    safeAddress,
  )

  if (incomingTransactions) {
    dispatch(addIncomingTransactions(incomingTransactions))
  }
}
