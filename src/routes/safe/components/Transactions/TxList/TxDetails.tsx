import { Icon, Link, Loader, Text } from '@gnosis.pm/safe-react-components'
import cn from 'classnames'
import { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import {
  ExpandedTxDetails,
  isModuleExecutionInfo,
  isMultiSendTxInfo,
  isMultiSigExecutionDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { useTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer, Centered, AlignItemsWithMargin } from './styled'
import { TxData } from './TxData'
import { TxExpandedActions } from './TxExpandedActions'
import { TxInfo } from './TxInfo'
import { TxLocationContext } from './TxLocationProvider'
import { TxOwners } from './TxOwners'
import { TxSummary } from './TxSummary'
import { isCancelTxDetails, NOT_AVAILABLE } from './utils'
import useLocalTxStatus from 'src/logic/hooks/useLocalTxStatus'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import TxModuleInfo from './TxModuleInfo'

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
}

export const TxDetails = ({ transaction }: TxDetailsProps): ReactElement => {
  const { txLocation } = useContext(TxLocationContext)
  const { data, loading } = useTransactionDetails(transaction.id)
  const txStatus = useLocalTxStatus(transaction)
  const willBeReplaced = txStatus === LocalTransactionStatus.WILL_BE_REPLACED
  const isPending = txStatus === LocalTransactionStatus.PENDING
  const currentUser = useSelector(userAccountSelector)
  const hasModule = transaction.txDetails && isModuleExecutionInfo(transaction.txDetails.detailedExecutionInfo)
  const isMultiSend = data && isMultiSendTxInfo(data.txInfo)

  // To avoid prop drilling into TxDataGroup, module details are positioned here accordingly
  const getModuleDetails = () => {
    if (!transaction.txDetails || !isModuleExecutionInfo(transaction.txDetails.detailedExecutionInfo)) {
      return null
    }

    return (
      <div className="tx-module">
        <TxModuleInfo detailedExecutionInfo={transaction.txDetails?.detailedExecutionInfo} />
      </div>
    )
  }

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
    <TxDetailsContainer ownerRows={hasModule ? 3 : 2}>
      <div className={cn('tx-summary', { 'will-be-replaced': willBeReplaced })}>
        <TxSummary txDetails={data} />
      </div>
      {isMultiSend && getModuleDetails()}
      <div
        className={cn('tx-details', {
          'no-padding': isMultiSend,
          'not-executed': !data.executedAt,
          'will-be-replaced': willBeReplaced,
        })}
      >
        <TxDataGroup txDetails={data} />
      </div>
      {!isMultiSend && getModuleDetails()}
      <div
        className={cn('tx-owners', {
          'will-be-replaced': willBeReplaced,
        })}
      >
        <TxOwners txDetails={data} isPending={isPending} />
      </div>
      {!isPending && !data.executedAt && txLocation !== 'history' && !!currentUser && (
        <div className={cn('tx-details-actions', { 'will-be-replaced': willBeReplaced })}>
          <TxExpandedActions transaction={transaction} />
        </div>
      )}
    </TxDetailsContainer>
  )
}
