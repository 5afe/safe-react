import { NonPayableTransactionObject } from 'src/types/contracts/types.d'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'

export const getTransactionHash = async ({
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
}: TxArgs): Promise<string> => {
  const txHash = await safeInstance.methods
    .getTransactionHash(to, valueInWei, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce)
    .call({
      from: sender,
    })

  return txHash
}

export const getApprovalTransaction = (safeInstance: GnosisSafe, txHash: string): NonPayableTransactionObject<void> => {
  try {
    return safeInstance.methods.approveHash(txHash)
  } catch (err) {
    console.error(`Error while approving transaction: ${err}`)
    throw err
  }
}

export const getExecutionTransaction = ({
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
}: TxArgs): NonPayableTransactionObject<boolean> => {
  try {
    return safeInstance.methods.execTransaction(
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
