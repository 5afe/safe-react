import { IconText, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import CustomIconText from 'src/components/CustomIconText'
import { isCustomTxInfo, isSettingsChangeTxInfo } from 'src/logic/safe/store/models/types/gateway.d'
import { KNOWN_MODULES } from 'src/utils/constants'
import { AssetInfo, isTokenTransferAsset } from './hooks/useAssetInfo'
import { TransactionStatusProps } from './hooks/useTransactionStatus'
import { TxTypeProps } from './hooks/useTransactionType'
import { StyledGroupedTransactions, StyledTransaction } from './styled'
import { TokenTransferAmount } from './TokenTransferAmount'

const TxInfo = ({ info }: { info: AssetInfo }) => {
  if (isTokenTransferAsset(info)) {
    return <TokenTransferAmount assetInfo={info} />
  }

  if (isSettingsChangeTxInfo(info)) {
    const UNKNOWN_MODULE = 'Unknown module'

    switch (info.settingsInfo?.type) {
      case 'SET_FALLBACK_HANDLER':
      case 'ADD_OWNER':
      case 'REMOVE_OWNER':
      case 'SWAP_OWNER':
      case 'CHANGE_THRESHOLD':
      case 'CHANGE_IMPLEMENTATION':
        break
      case 'ENABLE_MODULE':
      case 'DISABLE_MODULE':
        return <span>{KNOWN_MODULES[info.settingsInfo.module] ?? UNKNOWN_MODULE}</span>
    }
  }

  if (isCustomTxInfo(info)) {
    // TODO: request amount of actions when `methodName === 'multiSend'`
    //  if `actions === 1`, we need the `actionName`
    // const actions = txDetails.txData.dataDecoded.parameters.valueDecoded
    //
    // if (info.methodName === 'multiSend') {
    //   if (actions.length > 1) {
    //     return <span>{actions.length} actions</span>
    //   }
    //
    //   const { dataDecoded } = actions[0]
    //
    //   if (dataDecoded) {
    //     return <span>{dataDecoded.method}</span>
    //   }
    //
    //   return <span>1 action</span>
    // }

    return <span>{info.methodName}</span>
  }
  return null
}

type TxCollapsedProps = {
  nonce?: number
  type: TxTypeProps
  info?: AssetInfo
  time: string
  votes?: string
  actions?: string
  status: TransactionStatusProps
}

export const TxCollapsed = ({ nonce, type, info, time, votes, actions, status }: TxCollapsedProps): ReactElement => (
  <StyledTransaction>
    <div className="tx-nonce">
      <Text size="lg">{nonce}</Text>
    </div>
    <div className="tx-type">
      <CustomIconText iconUrl={type.icon} text={type.text} />
    </div>
    <div className="tx-info">{info && <TxInfo info={info} />}</div>
    <div className="tx-time">
      <Text size="lg">{time}</Text>
    </div>
    <div className="tx-votes">
      {votes && <IconText color="primary" iconType="owners" iconSize="sm" text={`${votes}`} textSize="sm" />}
    </div>
    <div className="tx-actions">{actions}</div>
    <div className="tx-status">
      <Text size="lg" color={status.color} className="col" strong>
        {status.text}
      </Text>
    </div>
  </StyledTransaction>
)

type TxCollapsedGroupedProps = {
  type: TxTypeProps
  info?: AssetInfo
  time: string
  votes?: string
  actions?: string
  status: TransactionStatusProps
}

export const TxCollapsedGrouped = ({
  type,
  info,
  time,
  votes,
  actions,
  status,
}: TxCollapsedGroupedProps): ReactElement => (
  <StyledGroupedTransactions>
    <div className="tx-type">
      <CustomIconText iconUrl={type.icon} text={type.text} />
    </div>
    <div className="tx-info">{info && <TxInfo info={info} />}</div>
    <div className="tx-time">
      <Text size="lg">{time}</Text>
    </div>
    <div className="tx-votes">
      {votes && <IconText color="primary" iconType="owners" iconSize="sm" text={`${votes}`} textSize="sm" />}
    </div>
    <div className="tx-actions">{actions}</div>
    <div className="tx-status">
      <Text size="lg" color={status.color} className="col" strong>
        {status.text}
      </Text>
    </div>
  </StyledGroupedTransactions>
)
