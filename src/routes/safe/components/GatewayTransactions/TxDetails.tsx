import { Loader, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { TxSummary } from 'src/routes/safe/components/GatewayTransactions/TxSummary'

import { useTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer } from './styled'
import { TxData } from './TxData'
import { TxInfo } from './TxInfo'
import { TxOwners } from './TxOwners'

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
        <TxInfo txInfo={data.txInfo} />
        <TxData txData={data.txData} />
      </div>
      <div className="tx-owners">
        <TxOwners detailedExecutionInfo={data.detailedExecutionInfo} />
      </div>
    </TxDetailsContainer>
  )
}
