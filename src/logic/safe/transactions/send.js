// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'

import { type Operation } from '~/logic/safe/transactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const CALL = 0
export const DELEGATE_CALL = 1
export const TX_TYPE_EXECUTION = 'execution'
export const TX_TYPE_CONFIRMATION = 'confirmation'

type Transaction = {
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  safeTxGas: number,
  baseGas: number,
  gasPrice: number,
  gasToken: string,
  refundReceiver: string,
}

export const getApprovalTransaction = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  refundReceiver,
  safeInstance,
  safeTxGas,
  sender,
  to,
  valueInWei,
}: Transaction & { nonce: number | string, sender: string }) => {
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

export const getExecutionTransaction = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  operation,
  refundReceiver,
  safeInstance,
  safeTxGas,
  sigs,
  to,
  valueInWei,
}: Transaction & { sigs: string }) => {
  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)

    return contract.methods.execTransaction(
      to,
      valueInWei,
      data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      sigs,
    )
  } catch (err) {
    console.error(`Error while creating transaction: ${err}`)

    throw err
  }
}
