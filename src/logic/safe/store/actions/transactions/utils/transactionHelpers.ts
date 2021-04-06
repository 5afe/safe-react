import { getNetworkInfo } from 'src/config'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { Transaction, TxArgs, RefundParams } from 'src/logic/safe/store/models/types/transaction'
import {
  BatchProcessTxsProps,
  TxServiceModel,
} from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { TypedDataUtils } from 'eth-sig-util'

export const isEmptyData = (data?: string | null): boolean => {
  return !data || data === EMPTY_DATA
}

export const isMultiSendTransaction = (tx: BuildTx['tx']): boolean => {
  return !isEmptyData(tx.data) && tx.data?.substring(0, 10) === '0x8d80ff0a' && Number(tx.value) === 0
}

export const isUpgradeTransaction = (tx: BuildTx['tx']): boolean => {
  return (
    !isEmptyData(tx.data) &&
    isMultiSendTransaction(tx) &&
    tx.data?.substr(308, 8) === '7de7edef' && // 7de7edef - changeMasterCopy (308, 8)
    tx.data?.substr(550, 8) === 'f08a0323' // f08a0323 - setFallbackHandler (550, 8)
  )
}

export type ServiceTx = TxServiceModel | TxToMock

export type BuildTx = BatchProcessTxsProps & {
  tx: ServiceTx | Transaction
}

export type TxToMock = TxArgs & Partial<TxServiceModel>

export function generateSafeTxHash(safeAddress: string, txArgs: TxArgs): string {
  const messageTypes = {
    EIP712Domain: [{ type: 'address', name: 'verifyingContract' }],
    SafeTx: [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'value' },
      { type: 'bytes', name: 'data' },
      { type: 'uint8', name: 'operation' },
      { type: 'uint256', name: 'safeTxGas' },
      { type: 'uint256', name: 'baseGas' },
      { type: 'uint256', name: 'gasPrice' },
      { type: 'address', name: 'gasToken' },
      { type: 'address', name: 'refundReceiver' },
      { type: 'uint256', name: 'nonce' },
    ],
  }

  const primaryType: 'SafeTx' = 'SafeTx' as const

  const typedData = {
    types: messageTypes,
    domain: {
      verifyingContract: safeAddress,
    },
    primaryType,
    message: {
      to: txArgs.to,
      value: txArgs.valueInWei,
      data: txArgs.data,
      operation: txArgs.operation,
      safeTxGas: txArgs.safeTxGas,
      baseGas: txArgs.baseGas,
      gasPrice: txArgs.gasPrice,
      gasToken: txArgs.gasToken,
      refundReceiver: txArgs.refundReceiver,
      nonce: txArgs.nonce,
    },
  }

  return `0x${TypedDataUtils.sign<typeof messageTypes>(typedData).toString('hex')}`
}
