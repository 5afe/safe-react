import { Button, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  isCustomTxInfo,
  isMultiSigExecutionDetails,
  MultiSigExecutionDetails,
} from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { getQueuedTransactionsByNonceAndLocation } from 'src/logic/safe/store/selectors/getTransactionDetails'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { LoadTransactionDetails } from './hooks/useTransactionDetails'
import { isCancelTransaction } from './utils'

type TxExpandedActionsProps = {
  data: LoadTransactionDetails['data']
  currentUser: string
  txLocation: 'queued.next' | 'queued.queued'
}

export const TxExpandedActions = ({ data, currentUser, txLocation }: TxExpandedActionsProps): ReactElement | null => {
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const transactionsByNonce = useSelector((state) =>
    getQueuedTransactionsByNonceAndLocation(
      state,
      (data?.detailedExecutionInfo as MultiSigExecutionDetails).nonce ?? -1,
      txLocation,
    ),
  )
  const [hasCancelTransaction, setHasCancelTransaction] = useState<boolean>(true)

  useEffect(() => {
    if (transactionsByNonce) {
      const withCancelTransaction = transactionsByNonce.some(
        ({ txInfo }) =>
          isCustomTxInfo(txInfo) &&
          isCancelTransaction({
            txInfo,
            safeAddress,
          }),
      )
      setHasCancelTransaction(withCancelTransaction)
    }
  }, [safeAddress, transactionsByNonce])

  // not the data we need
  if (!data || !isMultiSigExecutionDetails(data.detailedExecutionInfo)) {
    return null
  }

  // current Transaction is 'Cancellation Transaction'
  const currentIsCancelTransaction = isCustomTxInfo(data.txInfo)

  // current user didn't sign
  const currentUserSigned = data.detailedExecutionInfo.confirmations.some(({ signer }) =>
    sameAddress(signer, currentUser),
  )

  // we've reached the threshold
  // or we are 1 sign from reaching the threshold
  const canExecute =
    data.detailedExecutionInfo.confirmations.length >= data.detailedExecutionInfo.confirmationsRequired - 1

  return (
    <>
      <Button size="md" disabled={currentUserSigned}>
        <Text size="xl" color="white">
          {canExecute ? 'Execute' : 'Confirm'}
        </Text>
      </Button>
      {hasCancelTransaction || currentIsCancelTransaction ? null : (
        <Button size="md" color="error">
          <Text size="xl" color="white">
            Cancel
          </Text>
        </Button>
      )}
    </>
  )
}
