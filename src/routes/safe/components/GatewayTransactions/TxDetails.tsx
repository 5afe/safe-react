import { Loader, Text } from '@gnosis.pm/safe-react-components'
import cn from 'classnames'
import React, { ReactElement, useContext } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import {
  ExpandedTxDetails,
  isCustomTxInfo,
  isMultiSendTxInfo,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  MultiSigExecutionDetails,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { useTransactionActions } from './hooks/useTransactionActions'
import { useTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer } from './styled'
import { TxData } from './TxData'
import { TxExpandedActions } from './TxExpandedActions'
import { TxInfo } from './TxInfo'
import { TxLocationContext } from './TxLocationProvider'
import { TxOwners } from './TxOwners'
import { TxSummary } from './TxSummary'
import { isCancelTransaction, NOT_AVAILABLE } from './utils'

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

type TxDetailsProps = {
  transaction: Transaction
}

export const TxDetails = ({ transaction }: TxDetailsProps): ReactElement => {
  const { txLocation } = useContext(TxLocationContext)
  const { isUserAnOwner, ...actions } = useTransactionActions(transaction)
  const { data, loading } = useTransactionDetails(transaction.id)

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

  return (
    <TxDetailsContainer>
      <div className={cn('tx-summary', { 'will-be-replaced': transaction.txStatus === 'WILL_BE_REPLACED' })}>
        <TxSummary txDetails={data} />
      </div>
      <div
        className={cn('tx-details', {
          'no-padding': isMultiSendTxInfo(data.txInfo),
          'not-executed': !data.executedAt,
          'will-be-replaced': transaction.txStatus === 'WILL_BE_REPLACED',
        })}
      >
        <TxDataGroup txDetails={data} />
      </div>
      <div
        className={cn('tx-owners', {
          'no-owner': !isUserAnOwner,
          'will-be-replaced': transaction.txStatus === 'WILL_BE_REPLACED',
        })}
      >
        <TxOwners detailedExecutionInfo={data.detailedExecutionInfo} />
      </div>
      {!data.executedAt && txLocation !== 'history' && isUserAnOwner && (
        <div className={cn('tx-details-actions', { 'will-be-replaced': transaction.txStatus === 'WILL_BE_REPLACED' })}>
          <TxExpandedActions actions={actions} transaction={transaction} txLocation={txLocation} />
        </div>
      )}
    </TxDetailsContainer>
  )
}
