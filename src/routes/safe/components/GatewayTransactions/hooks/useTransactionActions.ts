import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { ExecutionInfo, isCustomTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { getQueuedTransactionsByNonceAndLocation } from 'src/logic/safe/store/selectors/getTransactionDetails'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { isCancelTransaction } from 'src/routes/safe/components/GatewayTransactions/utils'
import { grantedSelector } from 'src/routes/safe/container/selector'

export const isThresholdReached = (executionInfo: ExecutionInfo): boolean => {
  const { confirmationsSubmitted, confirmationsRequired } = executionInfo
  return confirmationsSubmitted === confirmationsRequired
}

export const isReadyToExecute = (executionInfo: ExecutionInfo): boolean => {
  const { confirmationsSubmitted, confirmationsRequired } = executionInfo
  const thresholdReached = isThresholdReached(executionInfo)
  const oneToGo = confirmationsSubmitted === confirmationsRequired - 1

  return thresholdReached || oneToGo
}

export type TransactionActions = {
  canConfirm: boolean
  canExecute: boolean
  canCancel: boolean
  isUserAnOwner: boolean
}

export const useTransactionActions = ({
  transaction,
  txLocation,
}: {
  transaction: Transaction
  txLocation: 'history' | 'queued.next' | 'queued.queued'
}): TransactionActions => {
  const currentUser = useSelector(userAccountSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const isUserAnOwner = useSelector(grantedSelector)
  const transactionsByNonce = useSelector((state) =>
    getQueuedTransactionsByNonceAndLocation(state, transaction.executionInfo?.nonce ?? -1, txLocation),
  )

  const [state, setState] = useState<TransactionActions>({
    canConfirm: false,
    canExecute: false,
    canCancel: false,
    isUserAnOwner,
  })

  useEffect(() => {
    if (isUserAnOwner && txLocation !== 'history' && transaction.executionInfo) {
      const { executionInfo } = transaction
      const { confirmationsSubmitted, confirmationsRequired } = executionInfo
      const currentUserSigned = !executionInfo.missingSigners?.some((missingSigner) =>
        sameAddress(missingSigner, currentUser),
      )

      const oneToGo = confirmationsSubmitted === confirmationsRequired - 1
      const thresholdReached = confirmationsSubmitted === confirmationsRequired
      const readyToExecute = thresholdReached || (oneToGo && !currentUserSigned)

      setState({
        canConfirm: txLocation === 'queued.queued' && !currentUserSigned,
        canExecute: txLocation === 'queued.next' && readyToExecute,
        canCancel: !transactionsByNonce.some(
          ({ txInfo }) =>
            isCustomTxInfo(txInfo) &&
            isCancelTransaction({
              txInfo,
              safeAddress,
            }),
        ),
        isUserAnOwner,
      })
    } else {
      setState((prev) => ({ ...prev, isUserAnOwner }))
    }
  }, [currentUser, isUserAnOwner, safeAddress, transaction, transactionsByNonce, txLocation])

  return state
}
