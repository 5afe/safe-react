import { Loader, Text } from '@gnosis.pm/safe-react-components'
import cn from 'classnames'
import React, { ReactElement } from 'react'
import {
  ExpandedTxDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'

import { LoadTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer } from './styled'
import { TxData } from './TxData'
import { TxInfo } from './TxInfo'
import { TxOwners } from './TxOwners'
import { TxSummary } from './TxSummary'

const TxDataGroup = ({
  txInfo,
  txData,
}: {
  txInfo: Transaction['txInfo']
  txData?: ExpandedTxDetails['txData']
}): ReactElement | null => {
  if (isTransferTxInfo(txInfo) || isSettingsChangeTxInfo(txInfo)) {
    return <TxInfo txInfo={txInfo} />
  }

  if (!txData) {
    return null
  }

  return <TxData txData={txData} />
}

export const TxDetails = ({ data, loading }: LoadTransactionDetails): ReactElement => {
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
      <div className={cn('tx-details', { 'no-padding': isMultiSend })}>
        <TxDataGroup txInfo={data.txInfo} txData={data.txData} />
      </div>
      <div className="tx-owners">
        <TxOwners detailedExecutionInfo={data.detailedExecutionInfo} />
      </div>
    </TxDetailsContainer>
  )
}
