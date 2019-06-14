// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { isEther } from '~/logic/tokens/utils/tokenHelpers'
import { type Token } from '~/logic/tokens/store/model/token'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { saveTxViaService } from '~/logic/safe/transactions'

export const CALL = 0
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const executeTransaction = async (
  safeInstance: any,
  to: string,
  valueInWei: number,
  data: string,
  operation: number | string,
  nonce: string | number,
  sender: string,
) => {
  try {
    // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
    const sigs = `0x000000000000000000000000${sender.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`

    const tx = await safeInstance.execTransaction(
      to,
      valueInWei,
      data,
      CALL,
      0,
      0,
      0,
      ZERO_ADDRESS,
      ZERO_ADDRESS,
      sigs,
      { from: sender },
    )
    await saveTxViaService(
      safeInstance.address,
      to,
      valueInWei,
      data,
      nonce,
      0,
      tx.tx, // tx hash,
      sender,
    )
    console.log(tx.tx)

    return tx
  } catch (error) {
    // eslint-disable-next-line
    console.log('Error executing the TX: ' + error)
    return 0
  }
}

export const createTransaction = async (safeAddress: string, to: string, valueInEth: string, token: Token) => {
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const web3 = getWeb3()
  const from = web3.currentProvider.selectedAddress
  const threshold = await safeInstance.getThreshold()
  const nonce = await safeInstance.nonce()
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
