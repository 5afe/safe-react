import { Loader, Text, Button } from '@gnosis.pm/safe-react-components'
import cn from 'classnames'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getQueuedTransactionsByNonceAndLocation } from 'src/logic/safe/store/selectors/getTransactionDetails'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import styled from 'styled-components'

import {
  ExpandedTxDetails,
  isCustomTxInfo,
  isMultiSigExecutionDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  MultiSigExecutionDetails,
} from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector, safeSelector } from 'src/logic/safe/store/selectors'
import { isCancelTransaction, NOT_AVAILABLE } from './utils'
import { LoadTransactionDetails, useTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer } from './styled'
import { TxData } from './TxData'
import { TxInfo } from './TxInfo'
import { TxOwners } from './TxOwners'
import { TxSummary } from './TxSummary'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

const NormalBreakingText = styled(Text)`
  line-break: normal;
  word-break: normal;
`

const TxDataGroup = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement | null => {
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  if (isTransferTxInfo(txDetails.txInfo) || isSettingsChangeTxInfo(txDetails.txInfo)) {
    return <TxInfo txInfo={txDetails.txInfo} />
  }

  if (
    // TODO: find a better way to identify a pending cancelling transaction
    //  I'm not comfortable with where this nested `&&` is going
    !txDetails.executedAt &&
    isCustomTxInfo(txDetails.txInfo) &&
    isCancelTransaction({ safeAddress, txInfo: txDetails.txInfo })
  ) {
    return (
      <NormalBreakingText size="lg">{`This is an empty cancelling transaction that doesn't send any funds.
       Executing this transaction will replace all currently awaiting transactions with nonce ${
         (txDetails.detailedExecutionInfo as MultiSigExecutionDetails).nonce ?? NOT_AVAILABLE
       }.`}</NormalBreakingText>
    )
  }

  if (!txDetails.txData) {
    return null
  }

  return <TxData txData={txDetails.txData} />
}

export const TxDetails = ({
  transactionId,
  txLocation,
}: {
  transactionId: string
  txLocation: 'history' | 'queued.next' | 'queued.queued'
}): ReactElement => {
  const { data, loading } = useTransactionDetails(transactionId, txLocation)

  if (loading) {
    return <Loader size="md" />
  }

  if (!data) {
    return (
      <TxDetailsContainer>
        <Text size="sm" strong>
          No data available
        </Text>
      </TxDetailsContainer>
    )
  }

  const isMultiSend = data.txInfo.type === 'Custom' && data.txInfo.methodName === 'multiSend'

  return (
    <TxDetailsContainer>
      <div className="tx-summary">
        <TxSummary txDetails={data} />
      </div>
      <div className={cn('tx-details', { 'no-padding': isMultiSend, 'not-executed': !data.executedAt })}>
        <TxDataGroup txDetails={data} />
      </div>
      <div className="tx-owners">
        <TxOwners detailedExecutionInfo={data.detailedExecutionInfo} />
      </div>
      {!data.executedAt && txLocation !== 'history' && (
        <div className="tx-actions">
          <TxActionButtons data={data} txLocation={txLocation} />
        </div>
      )}
    </TxDetailsContainer>
  )
}

const TxActionButtons = ({
  data,
  txLocation,
}: {
  data: LoadTransactionDetails['data']
  txLocation: 'queued.next' | 'queued.queued'
}): ReactElement | null => {
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const currentUser = useSelector(userAccountSelector)
  const currentSafe = useSelector(safeSelector)
  const transactionsByNonce = useSelector((state) =>
    getQueuedTransactionsByNonceAndLocation(
      state,
      (data?.detailedExecutionInfo as MultiSigExecutionDetails).nonce ?? -1,
      txLocation,
    ),
  )
  const [hasCancelTransaction, setHashCancelTransaction] = useState<boolean | undefined>()

  useEffect(() => {
    if (transactionsByNonce) {
      console.log(transactionsByNonce)
      if (
        transactionsByNonce.some(({ txInfo }) => isCustomTxInfo(txInfo) && isCancelTransaction({ txInfo, safeAddress }))
      ) {
        setHashCancelTransaction(true)
      } else {
        setHashCancelTransaction(false)
      }
    }
  }, [safeAddress, transactionsByNonce])

  if (currentUser && currentSafe) {
    // if `currentUser` is not an owner, then no actions
    if (!currentSafe.owners.some(({ address }) => sameAddress(address, currentUser))) {
      return null
    }
  }

  // not the data we need
  if (!data || !isMultiSigExecutionDetails(data.detailedExecutionInfo)) {
    return null
  }

  // still loading information
  if (typeof hasCancelTransaction === 'undefined') {
    return <Loader size="sm" />
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
      <Button size="md" color="primary" variant="contained" disabled={currentUserSigned}>
        <Text size="xl" color="white">
          {canExecute ? 'Execute' : 'Confirm'}
        </Text>
      </Button>
      {hasCancelTransaction || currentIsCancelTransaction ? null : (
        <Button size="md" color="error" variant="contained" className="error">
          <Text size="xl" color="white">
            Cancel
          </Text>
        </Button>
      )}
    </>
  )
}
