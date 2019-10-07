// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { getWeb3, getAccountFrom } from '~/logic/wallets/getWeb3'
import { type Operation } from '~/logic/safe/transactions'
import { calculateGasOf, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { CALL } from '.'

export const estimateApprovalTxGasCosts = async (safeAddress: string, to: string, data: string): Promise<number> => {
  try {
    const web3 = getWeb3()
    const from = await getAccountFrom(web3)
    const safeInstance = new web3.eth.Contract(GnosisSafeSol.abi, safeAddress)
    const nonce = await safeInstance.methods.nonce().call()
    const txHash = await safeInstance.methods
      .getTransactionHash(to, 0, data, CALL, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, nonce)
      .call({
        from,
      })
    const approvalData = await safeInstance.methods.approveHash(txHash).encodeABI()
    const gas = await calculateGasOf(approvalData, from, safeAddress)
    const gasPrice = await calculateGasPrice()

    return gas * parseInt(gasPrice, 10)
  } catch (err) {
    console.error(`Error while estimating approval transaction gas costs: ${err}`)

    return 1000000000000000
  }
}

export const estimateExecuteTxGasCosts = async (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: string | number,
  sender: string,
  sigs: string,
): Promise<number> => {
  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)
    const executionData = await contract.methods
      .execTransaction(to, valueInWei, data, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS)
      .encodeABI()
    const gas = await calculateGasOf(executionData, sender, safeInstance.address)
    const gasPrice = await calculateGasPrice()

    return gas * parseInt(gasPrice, 10)
  } catch (err) {
    console.error(`Error while estimating transaction execution gas costs: ${err}`)

    return 0.001
  }
}
