// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { List } from 'immutable'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'
import { getWeb3, getAccountFrom } from '~/logic/wallets/getWeb3'
import { calculateGasOf, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { CALL } from '.'

export const estimateTxGasCosts = async (
  safeAddress: string,
  to: string,
  data: string,
  confirmations?: List<Confirmation>,
): Promise<number> => {
  try {
    const web3 = getWeb3()
    const from = await getAccountFrom(web3)
    const safeInstance = new web3.eth.Contract(GnosisSafeSol.abi, safeAddress)
    const nonce = await safeInstance.methods.nonce().call()
    const threshold = await safeInstance.methods.getThreshold().call()

    const isExecution = (confirmations && confirmations.size) || threshold === '1'

    let txData
    if (isExecution) {
      // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
      const signatures = confirmations
        || `0x000000000000000000000000${from.replace(
          '0x',
          '',
        )}000000000000000000000000000000000000000000000000000000000000000001`
      txData = await safeInstance.methods
        .execTransaction(to, 0, data, CALL, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, signatures)
        .encodeABI()
    } else {
      const txHash = await safeInstance.methods
        .getTransactionHash(to, 0, data, CALL, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, nonce)
        .call({
          from,
        })
      txData = await safeInstance.methods.approveHash(txHash).encodeABI()
    }

    const gas = await calculateGasOf(txData, from, safeAddress)
    const gasPrice = await calculateGasPrice()

    return gas * parseInt(gasPrice, 10)
  } catch (err) {
    console.error(`Error while estimating transaction execution gas costs: ${err}`)

    return 10000
  }
}
