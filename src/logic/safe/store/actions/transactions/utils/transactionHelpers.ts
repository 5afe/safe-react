import { TypedDataUtils } from 'eth-sig-util'

import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { Transaction, TxArgs } from 'src/logic/safe/store/models/types/transaction'
import {
  BatchProcessTxsProps,
  TxServiceModel,
} from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { getEip712MessageTypes, generateTypedDataFrom } from 'src/logic/safe/transactions/offchainSigner/EIP712Signer'

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

export function generateSafeTxHash(safeAddress: string, safeVersion: string, txArgs: TxArgs): string {
  const typedData = generateTypedDataFrom({ safeAddress, safeVersion, ...txArgs })

  const messageTypes = getEip712MessageTypes(safeVersion)

  return `0x${TypedDataUtils.sign<typeof messageTypes>(typedData).toString('hex')}`
}
