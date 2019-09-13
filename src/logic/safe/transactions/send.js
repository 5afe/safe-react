// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { isEther } from '~/logic/tokens/utils/tokenHelpers'
import { type Token } from '~/logic/tokens/store/model/token'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { type Operation, saveTxToHistory } from '~/logic/safe/transactions'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { getErrorMessage } from '~/test/utils/ethereumErrors'

export const CALL = 0
export const TX_TYPE_EXECUTION = 'execution'
export const TX_TYPE_CONFIRMATION = 'confirmation'

export const approveTransaction = async (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: number,
  sender: string,
) => {
  const contractTxHash = await safeInstance.getTransactionHash(
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
  const receipt = await safeInstance.approveHash(contractTxHash, { from: sender })

  await saveTxToHistory(
    safeInstance,
    to,
    valueInWei,
    data,
    operation,
    nonce,
    receipt.tx, // tx hash,
    sender,
    TX_TYPE_CONFIRMATION,
  )

  return receipt
}

export const executeTransaction = async (
  showNotification: Function,
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

  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)

    const transactionHash = await contract.methods
      .execTransaction(to, valueInWei, data, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
      .send({
        from: sender,
      })
      .once('transactionHash', (transactionHash) => {
        showNotification()
      })
      .on('error', (error) => {
        console.log('Tx error:', error)
      })
      .then(async (receipt) => {
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

        return receipt.transactionHash
      })

    return transactionHash
  } catch (error) {
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
