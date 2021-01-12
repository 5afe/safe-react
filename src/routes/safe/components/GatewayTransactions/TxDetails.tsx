import { Loader, Text } from '@gnosis.pm/safe-react-components'
import cn from 'classnames'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import {
  ExpandedTxDetails,
  isCustomTxInfo,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  MultiSigExecutionDetails,
} from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { isCancelTransaction, NOT_AVAILABLE } from './utils'
import { LoadTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer } from './styled'
import { TxData } from './TxData'
import { TxInfo } from './TxInfo'
import { TxOwners } from './TxOwners'
import { TxSummary } from './TxSummary'

const NormalBreakingText = styled(Text)`
  line-break: normal;
  word-break: normal;
`

const TxDataGroup = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement | null => {
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  if (isTransferTxInfo(txDetails.txInfo) || isSettingsChangeTxInfo(txDetails.txInfo)) {
    return <TxInfo txInfo={txDetails.txInfo} />
  }

  if (isCustomTxInfo(txDetails.txInfo) && isCancelTransaction({ safeAddress, txInfo: txDetails.txInfo })) {
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
        <TxDataGroup txDetails={data} />
      </div>
      <div className="tx-owners">
        <TxOwners detailedExecutionInfo={data.detailedExecutionInfo} />
      </div>
    </TxDetailsContainer>
  )
}
