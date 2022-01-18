import { useMemo, useRef } from 'react'
import {
  Erc20Transfer,
  Erc721Transfer,
  MultisigExecutionInfo,
  Operation,
  TokenType,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { List, Record } from 'immutable'

import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'
import { ConfirmationProps } from 'src/logic/safe/store/models/types/confirmation'
import { ExpandedTxDetails, isMultiSigExecutionDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { extractSafeAddress } from 'src/routes/routes'
import { Overwrite } from 'src/types/helpers'

export type TransactionType = Overwrite<Transaction, { txDetails: ExpandedTxDetails }>

type TxInfoType = {
  confirmations: List<Record<ConfirmationProps> & Readonly<ConfirmationProps>>
  data: string
  baseGas: string
  gasPrice: string
  safeTxGas: string
  gasToken: string
  nonce: number
  refundReceiver: string
  safeTxHash: string
  value: string
  to: string
  operation: Operation
  origin: string
  id: string
}

export const useTxInfo = (transaction: TransactionType = {} as TransactionType): TxInfoType => {
  const t = useRef(transaction)
  const safeAddress = extractSafeAddress()

  const confirmations = useMemo(
    () =>
      t.current.txDetails.detailedExecutionInfo && isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? List(
            t.current.txDetails.detailedExecutionInfo.confirmations.map(({ signer, signature }) =>
              makeConfirmation({ owner: signer.value, signature }),
            ),
          )
        : List([]),
    [],
  )

  const data = useMemo(() => t.current.txDetails.txData?.hexData ?? EMPTY_DATA, [])

  const baseGas = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.baseGas
        : '0',
    [],
  )

  const gasPrice = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.gasPrice
        : '0',
    [],
  )

  const safeTxGas = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.safeTxGas
        : '0',
    [],
  )

  const gasToken = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.gasToken
        : ZERO_ADDRESS,
    [],
  )

  const nonce = useMemo(() => (t.current.executionInfo as MultisigExecutionInfo)?.nonce ?? 0, [])

  const refundReceiver = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.refundReceiver.value
        : ZERO_ADDRESS,
    [],
  )

  const safeTxHash = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.safeTxHash
        : EMPTY_DATA,
    [],
  )

  const value = useMemo(() => {
    switch (t.current.txInfo.type) {
      case 'Transfer':
        if (t.current.txInfo.transferInfo.type === TokenType.NATIVE_COIN) {
          return t.current.txInfo.transferInfo.value
        } else {
          return t.current.txDetails.txData?.value ?? '0'
        }
      case 'Custom':
        return t.current.txInfo.value
      case 'Creation':
      case 'SettingsChange':
      default:
        return '0'
    }
  }, [])

  const to = useMemo(() => {
    switch (t.current.txInfo.type) {
      case 'Transfer':
        if (t.current.txInfo.transferInfo.type === TokenType.NATIVE_COIN) {
          return t.current.txInfo.recipient.value
        } else {
          return (t.current.txInfo.transferInfo as Erc20Transfer | Erc721Transfer).tokenAddress
        }
      case 'Custom':
        return t.current.txInfo.to.value
      case 'Creation':
      case 'SettingsChange':
      default:
        return safeAddress
    }
  }, [safeAddress])

  const operation = useMemo(() => t.current.txDetails.txData?.operation ?? Operation.CALL, [])

  const origin = useMemo(
    () =>
      t.current.safeAppInfo ? JSON.stringify({ name: t.current.safeAppInfo.name, url: t.current.safeAppInfo.url }) : '',
    [],
  )

  const id = useMemo(() => t.current.id, [])

  return {
    confirmations,
    data,
    baseGas,
    gasPrice,
    safeTxGas,
    gasToken,
    nonce,
    refundReceiver,
    safeTxHash,
    value,
    to,
    operation,
    origin,
    id,
  }
}
