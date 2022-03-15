import { Dot, IconText as IconTextSrc, Loader, Text, Tooltip } from '@gnosis.pm/safe-react-components'
import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
import { ReactElement, useContext, useRef } from 'react'
import styled from 'styled-components'
import { MultiSend, Custom } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSelector } from 'react-redux'

import { CustomIconText } from 'src/components/CustomIconText'
import {
  isCustomTxInfo,
  isMultiSendTxInfo,
  isSettingsChangeTxInfo,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { TxCollapsedActions } from './TxCollapsedActions'
import { formatDateTime, formatTime, formatTimeInWords } from 'src/utils/date'
import { sameString } from 'src/utils/strings'
import { AssetInfo, isTokenTransferAsset } from './hooks/useAssetInfo'
import { TransactionStatusProps } from './hooks/useTransactionStatus'
import { TxTypeProps } from './hooks/useTransactionType'
import { StyledGroupedTransactions, StyledTransaction } from './styled'
import { TokenTransferAmount } from './TokenTransferAmount'
import { TxsInfiniteScrollContext } from './TxsInfiniteScroll'
import { TxLocationContext } from './TxLocationProvider'
import { CalculatedVotes } from './TxQueueCollapsed'
import { getTxTo, isAwaitingExecution } from './utils'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { useKnownAddress } from './hooks/useKnownAddress'
import useTxStatus from 'src/logic/hooks/useTxStatus'

const TxInfo = ({ info, name }: { info: AssetInfo; name?: string }) => {
  if (isTokenTransferAsset(info)) {
    return <TokenTransferAmount assetInfo={info} />
  }

  if (isSettingsChangeTxInfo(info) && !isCustomTxInfo(info)) {
    const UNKNOWN_MODULE = 'Unknown module'

    switch (info.settingsInfo?.type) {
      case 'SET_FALLBACK_HANDLER':
      case 'ADD_OWNER':
      case 'REMOVE_OWNER':
      case 'SWAP_OWNER':
      case 'CHANGE_THRESHOLD':
      case 'CHANGE_IMPLEMENTATION':
      case 'SET_GUARD':
      case 'DELETE_GUARD':
        break
      case 'ENABLE_MODULE':
      case 'DISABLE_MODULE':
        return (
          <Text size="xl" as="span">
            {name || UNKNOWN_MODULE}
          </Text>
        )
    }
  }

  if (isCustomTxInfo(info)) {
    if (isMultiSendTxInfo(info)) {
      return (
        <Text size="xl" as="span">
          {info.actionCount} {`action${(info as MultiSend).actionCount > 1 ? 's' : ''}`}
        </Text>
      )
    }

    return (
      <Text size="xl" as="span">
        {(info as Custom).methodName}
      </Text>
    )
  }
  return null
}

const CircularProgressPainter = styled.div<{ color: ThemeColors }>`
  color: ${({ theme, color }) => theme.colors[color]};
`

const SmallDot = styled(Dot)`
  height: 8px;
  width: 8px;
  background-color: ${({ theme, color }) => theme.colors[color]} !important;
`

const IconText = styled(IconTextSrc)`
  p {
    font-weight: bold;
  }
`

const TooltipContent = styled.div`
  width: max-content;
`

type TxCollapsedProps = {
  transaction: Transaction
  isGrouped?: boolean
  nonce?: number
  type: TxTypeProps
  info?: AssetInfo
  time: number
  votes?: CalculatedVotes
  status: TransactionStatusProps
}

export const TxCollapsed = ({
  transaction,
  isGrouped = false,
  nonce,
  type,
  info,
  time,
  votes,
  status,
}: TxCollapsedProps): ReactElement => {
  const { txLocation } = useContext(TxLocationContext)
  const { ref, lastItemId } = useContext(TxsInfiniteScrollContext)
  const userAddress = useSelector(userAccountSelector)
  const toAddress = getTxTo(transaction)
  const toInfo = useKnownAddress(toAddress)
  const txStatus = useTxStatus(transaction)
  const isPending = txStatus === LocalTransactionStatus.PENDING
  const willBeReplaced = txStatus === LocalTransactionStatus.WILL_BE_REPLACED ? ' will-be-replaced' : ''

  const txCollapsedNonce = (
    <div className={'tx-nonce' + willBeReplaced}>
      <Text size="xl">{nonce}</Text>
    </div>
  )

  const txCollapsedType = (
    <div className={'tx-type' + willBeReplaced}>
      <CustomIconText
        address={toAddress?.value || '0x'}
        iconUrl={type.icon || toInfo?.logoUri || undefined}
        iconUrlFallback={type.fallbackIcon}
        text={type.text || toInfo?.name || undefined}
      />
    </div>
  )

  const txCollapsedInfo = (
    <div className={'tx-info' + willBeReplaced}>{info && <TxInfo info={info} name={toInfo?.name || undefined} />}</div>
  )

  const timestamp = useRef<HTMLDivElement | null>(null)

  const txCollapsedTime = (
    <div className={'tx-time' + willBeReplaced}>
      <Tooltip title={formatDateTime(time)} arrow backgroundColor="white" size="lg">
        <TooltipContent ref={timestamp}>
          <Text size="xl">{txLocation === 'history' ? formatTime(time) : formatTimeInWords(time)}</Text>
        </TooltipContent>
      </Tooltip>
    </div>
  )

  const txCollapsedVotes = (
    <div className={'tx-votes' + willBeReplaced}>
      {votes && (
        <IconText
          color={votes.required > votes.submitted ? 'secondaryLight' : 'primary'}
          iconType="owners"
          iconSize="sm"
          text={`${votes.votes}`}
          textSize="md"
        />
      )}
    </div>
  )

  const txCollapsedActions = (
    <div className={'tx-actions' + willBeReplaced}>
      {!isPending && userAddress && txLocation !== 'history' && transaction && (
        <TxCollapsedActions transaction={transaction} />
      )}
    </div>
  )

  // attaching ref to a div element as it was causing troubles to add a `ref` to a FunctionComponent
  const txCollapsedStatus = (
    <div className="tx-status" ref={sameString(lastItemId, transaction.id) ? ref : null}>
      {isPending ? (
        <CircularProgressPainter color={status.color}>
          <Loader size="xs" color="pending" />
        </CircularProgressPainter>
      ) : (
        isAwaitingExecution(txStatus) && <SmallDot color={status.color} />
      )}
      <Text size="md" color={status.color} className="col" strong>
        {status.text}
      </Text>
    </div>
  )

  return isGrouped ? (
    <StyledGroupedTransactions>
      {/* no nonce */}
      {txCollapsedType}
      {txCollapsedInfo}
      {txCollapsedTime}
      {txCollapsedVotes}
      {txCollapsedActions}
      {txCollapsedStatus}
    </StyledGroupedTransactions>
  ) : (
    <StyledTransaction className={sameString(status.text, 'Failed') ? 'failed-transaction' : ''}>
      {txCollapsedNonce}
      {txCollapsedType}
      {txCollapsedInfo}
      {txCollapsedTime}
      {txCollapsedVotes}
      {txCollapsedActions}
      {txCollapsedStatus}
    </StyledTransaction>
  )
}
