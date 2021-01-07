import { Loader, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import {
  ExpandedTxDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { TxSummary } from 'src/routes/safe/components/GatewayTransactions/TxSummary'

import { useTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer } from './styled'
import { TxData } from './TxData'
import { TxInfo } from './TxInfo'
import { TxOwners } from './TxOwners'

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

export const TxDetails = ({ transactionId }: { transactionId: string }): ReactElement => {
  const { data, loading } = useTransactionDetails(transactionId, 'history')

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
      <div className="tx-summary">
        <TxSummary txDetails={data} />
      </div>
      <div className="tx-data">
        <TxDataGroup txInfo={data.txInfo} txData={data.txData} />
      </div>
      <div className="tx-owners">
        <TxOwners detailedExecutionInfo={data.detailedExecutionInfo} />
      </div>
    </TxDetailsContainer>
  )
}
