// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type Operation } from '~/logic/safe/transactions'

export const CALL = 0
export const TX_TYPE_EXECUTION = 'execution'
export const TX_TYPE_CONFIRMATION = 'confirmation'

export const getApprovalTransaction = async (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: number,
  safeTxGas: number,
  baseGas: number,
  gasPrice: number,
  gasToken: string,
  refundReceiver: string,
  sender: string,
) => {
  const txHash = await safeInstance.getTransactionHash(
    to,
    valueInWei,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce,
    {
      from: sender,
    },
  )

  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)

    return contract.methods.approveHash(txHash)
  } catch (err) {
    console.error(`Error while approving transaction: ${err}`)
    throw err
  }
}

export const getExecutionTransaction = async (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: string | number,
  safeTxGas: string | number,
  baseGas: string | number,
  gasPrice: string | number,
  gasToken: string,
  refundReceiver: string,
  sender: string,
  sigs: string,
) => {
  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)

    return contract.methods.execTransaction(to, valueInWei, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, sigs)
  } catch (err) {
    console.error(`Error while creating transaction: ${err}`)

    throw err
  }
}
