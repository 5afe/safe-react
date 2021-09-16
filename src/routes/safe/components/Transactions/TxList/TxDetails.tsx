import { Icon, Link, Loader, Text } from '@gnosis.pm/safe-react-components'
import cn from 'classnames'
import { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import {
  ExpandedTxDetails,
  isMultiSendTxInfo,
  isMultiSigExecutionDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionActions } from './hooks/useTransactionActions'
import { useTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer, Centered, AlignItemsWithMargin } from './styled'
import { TxData } from './TxData'
import { TxExpandedActions } from './TxExpandedActions'
import { TxInfo } from './TxInfo'
import { TxLocationContext } from './TxLocationProvider'
import { TxOwners } from './TxOwners'
import { TxSummary } from './TxSummary'
import { isCancelTxDetails, NOT_AVAILABLE } from './utils'

const NormalBreakingText = styled(Text)`
  line-break: normal;
  word-break: normal;
`

const TxDataGroup = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement | null => {
  if (isTransferTxInfo(txDetails.txInfo) || isSettingsChangeTxInfo(txDetails.txInfo)) {
    return <TxInfo txInfo={txDetails.txInfo} />
  }

  if (isCancelTxDetails(txDetails.txInfo) && isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)) {
    const txNonce = `${txDetails.detailedExecutionInfo.nonce ?? NOT_AVAILABLE}`
    const isTxExecuted = txDetails.executedAt

    // executed rejection transaction
    let message = `This is an on-chain rejection that didn't send any funds.
     This on-chain rejection replaced all transactions with nonce ${txNonce}.`

    if (!isTxExecuted) {
      // queued rejection transaction
      message = `This is an on-chain rejection that doesn't send any funds.
 Executing this on-chain rejection will replace all currently awaiting transactions with nonce ${txNonce}.`
    }
    return (
      <>
        <NormalBreakingText size="xl">{message}</NormalBreakingText>
        {!isTxExecuted && (
          <>
            <br />
            <Link
              href="https://help.gnosis-safe.io/en/articles/4738501-why-do-i-need-to-pay-for-cancelling-a-transaction"
              target="_blank"
              rel="noreferrer"
              title="Why do I need to pay for rejecting a transaction?"
            >
              <AlignItemsWithMargin>
                <Text size="xl" as="span" color="primary">
                  Why do I need to pay for rejecting a transaction?
                </Text>
                <Icon size="sm" type="externalLink" color="primary" />
              </AlignItemsWithMargin>
            </Link>
          </>
        )}
      </>
    )
  }

  if (!txDetails.txData) {
    return null
  }

  return <TxData txData={txDetails.txData} txInfo={txDetails.txInfo} />
}

type TxDetailsProps = {
  transaction: Transaction
  actions?: TransactionActions
}

export const TxDetails = ({ transaction, actions }: TxDetailsProps): ReactElement => {
  const { txLocation } = useContext(TxLocationContext)
  const { data, loading } = useTransactionDetails(transaction.id)

  if (loading) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  if (!data) {
    return (
      <TxDetailsContainer>
        <Text size="xl" strong>
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
          'no-owner': txLocation !== 'history' && !actions?.isUserAnOwner,
          'will-be-replaced': transaction.txStatus === 'WILL_BE_REPLACED',
        })}
      >
        <TxOwners txDetails={data} />
      </div>
      {!data.executedAt && txLocation !== 'history' && actions?.isUserAnOwner && (
        <div className={cn('tx-details-actions', { 'will-be-replaced': transaction.txStatus === 'WILL_BE_REPLACED' })}>
          <TxExpandedActions transaction={transaction} />
        </div>
      )}
    </TxDetailsContainer>
  )
}
