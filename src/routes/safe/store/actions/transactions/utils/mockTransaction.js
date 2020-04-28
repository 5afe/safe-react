// @flow

import { buildTransactionFrom } from '../fetchTransactions'

// type TxServiceModel = {
//   blockNumber: ?number,
//   safeTxHash: string,
//   executor: string,
//   executionDate: ?string,
//   confirmations: ConfirmationServiceModel[],
//   isExecuted: boolean,
//   isSuccessful: boolean,
//   transactionHash: ?string,
//   creationTx?: boolean,
// }

// safeInstance,
// to,
// valueInWei,
// data: txData,
// operation,
// nonce,
// safeTxGas,
// baseGas: 0,
// gasPrice: 0,
// gasToken: ZERO_ADDRESS,
// refundReceiver: ZERO_ADDRESS,
// sender: from,
// sigs,

export const mockTransactionCreation = (txArgs) => {
  const {
    baseGas,
    data,
    gasPrice,
    gasToken,
    nonce,
    operation,
    refundReceiver,
    safeTxGas,
    safeTxHash,
    submissionDate,
    to,
    valueInWei: value,
  } = txArgs

  return {
    data,
    to,
    value,
    nonce,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    safeTxHash,
    submissionDate,
    creationTx: false,
  }
}
