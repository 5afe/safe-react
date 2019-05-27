// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { createAction } from 'redux-actions'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { type Token } from '~/logic/tokens/store/model/token'
import { type GlobalState } from '~/store'
import { isEther } from '~/logic/tokens/utils/tokenHelpers'
import { getSafeEthereumInstance } from '~/logic/safe/safeFrontendOperations'
import { executeTransaction, CALL } from '~/logic/safe/transactions'
import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'

export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
export const addTransactions = createAction<string, *>(ADD_TRANSACTIONS)

const createTransaction = (
  safeAddress: string,
  to: string,
  valueInEth: string,
  token: Token,
  openSnackbar: Function,
) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const isSendingETH = isEther(token.symbol)

  const safeInstance = await getSafeEthereumInstance(safeAddress)
  const web3 = getWeb3()
  const from = web3.currentProvider.selectedAddress
  const threshold = await safeInstance.getThreshold()
  const nonce = await safeInstance.nonce()
  const txRecipient = isSendingETH ? to : token.address
  let valueInWei = web3.utils.toWei(valueInEth, 'ether')
  const isExecution = threshold.toNumber() === 1

  let txData = EMPTY_DATA
  if (!isSendingETH) {
    const StandardToken = await getStandardTokenContract()
    const sendToken = await StandardToken.at(token.address)

    txData = sendToken.contract.methods.transfer(to, valueInWei).encodeABI()
    // valueInWei should be 0 if we send tokens
    // the real value is encoded in txData and will be used by the contract
    // if valueInWei > 0 it would send ETH from the safe
    valueInWei = 0
  }

  let txHash
  if (isExecution) {
    txHash = await executeTransaction(safeInstance, txRecipient, valueInWei, txData, CALL, nonce, from)
    openSnackbar('Transaction has been submitted', 'success')
  } else {
    // txHash = await approveTransaction(safeAddress, to, valueInWei, txData, CALL, nonce)
  }
  // dispatch(addTransactions(txHash))

  return txHash
}

export default createTransaction
