// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { isEther } from '~/logic/tokens/utils/tokenHelpers'
import { type Token } from '~/logic/tokens/store/model/token'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { type Operation, saveTxToHistory } from '~/logic/safe/transactions'
import { type NotificationsQueue } from '~/logic/notifications'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { getErrorMessage } from '~/test/utils/ethereumErrors'

export const CALL = 0
export const TX_TYPE_EXECUTION = 'execution'
export const TX_TYPE_CONFIRMATION = 'confirmation'

export const approveTransaction = async (
  notiQueue: NotificationsQueue,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: number,
  sender: string,
) => {
  const txHash = await safeInstance.getTransactionHash(
    to,
    valueInWei,
    data,
    operation,
    0,
    0,
    0,
    ZERO_ADDRESS,
    ZERO_ADDRESS,
    nonce,
    {
      from: sender,
    },
  )

  const beforeExecutionKey = enqueueSnackbar(notiQueue.beforeExecution.description, notiQueue.beforeExecution.options)
  let pendingExecutionKey
  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)

    const transactionHash = await contract.methods
      .approveHash(txHash)
      .send({
        from: sender,
      })
      .once('transactionHash', () => {
        closeSnackbar(beforeExecutionKey)
        pendingExecutionKey = enqueueSnackbar(
          notiQueue.pendingExecution.single.description,
          notiQueue.pendingExecution.single.options,
        )
      })
      .on('error', (error) => {
        /* eslint-disable */
        console.log('Tx error:', error)
      })
      .then(async (receipt) => {
        closeSnackbar(pendingExecutionKey)
        await saveTxToHistory(
          safeInstance,
          to,
          valueInWei,
          data,
          operation,
          nonce,
          receipt.transactionHash,
          sender,
          TX_TYPE_CONFIRMATION,
        )
        enqueueSnackbar(notiQueue.afterExecution.description, notiQueue.afterExecution.options)
        return receipt.transactionHash
      })

    return transactionHash
  } catch (error) {
    closeSnackbar(pendingExecutionKey)
    enqueueSnackbar(notiQueue.afterExecutionError.description, notiQueue.afterExecutionError.options)

    /* eslint-disable */
    const executeData = safeInstance.contract.methods.approveHash(txHash).encodeABI()
    const errMsg = await getErrorMessage(safeInstance.address, 0, executeData, sender)
    console.log(`Error executing the TX: ${errMsg}`)

    throw error
  }
}

export const executeTransaction = async (
  notiQueue: NotificationsQueue,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: string | number,
  sender: string,
  signatures?: string,
) => {
  let sigs = signatures

  // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
  if (!sigs) {
    sigs = `0x000000000000000000000000${sender.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`
  }

  const beforeExecutionKey = enqueueSnackbar(notiQueue.beforeExecution.description, notiQueue.beforeExecution.options)
  let pendingExecutionKey
  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)

    const transactionHash = await contract.methods
      .execTransaction(to, valueInWei, data, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
      .send({
        from: sender,
      })
      .once('transactionHash', () => {
        closeSnackbar(beforeExecutionKey)
        pendingExecutionKey = enqueueSnackbar(
          notiQueue.pendingExecution.single.description,
          notiQueue.pendingExecution.single.options,
        )
      })
      .on('error', (error) => {
        console.log('Tx error:', error)
      })
      .then(async (receipt) => {
        closeSnackbar(pendingExecutionKey)
        await saveTxToHistory(
          safeInstance,
          to,
          valueInWei,
          data,
          operation,
          nonce,
          receipt.transactionHash,
          sender,
          TX_TYPE_EXECUTION,
        )
        enqueueSnackbar(notiQueue.afterExecution.description, notiQueue.afterExecution.options)
        return receipt.transactionHash
      })

    return transactionHash
  } catch (error) {
    closeSnackbar(beforeExecutionKey)
    enqueueSnackbar(notiQueue.afterExecutionError.description, notiQueue.afterExecutionError.options)

    /* eslint-disable */
    const executeDataUsedSignatures = safeInstance.contract.methods
      .execTransaction(to, valueInWei, data, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
      .encodeABI()
    const errMsg = await getErrorMessage(safeInstance.address, 0, executeDataUsedSignatures, sender)
    console.log(`Error executing the TX: ${errMsg}`)

    throw error
  }
}

export const createTransaction = async (safeAddress: string, to: string, valueInEth: string, token: Token) => {
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const web3 = getWeb3()
  const from = web3.currentProvider.selectedAddress
  const threshold = await safeInstance.getThreshold()
  const nonce = (await safeInstance.nonce()).toString()
  const valueInWei = web3.utils.toWei(valueInEth, 'ether')
  const isExecution = threshold.toNumber() === 1

  let txData = EMPTY_DATA
  if (!isEther(token.symbol)) {
    const StandardToken = await getStandardTokenContract()
    const sendToken = await StandardToken.at(token.address)

    txData = sendToken.contract.transfer(to, valueInWei).encodeABI()
  }

  let txHash
  if (isExecution) {
    txHash = await executeTransaction(safeInstance, to, valueInWei, txData, CALL, nonce, from)
  } else {
    // txHash = await approveTransaction(safeAddress, to, valueInWei, txData, CALL, nonce)
  }

  return txHash
}
