import { EthHashInfo, Loader, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { TransactionSummary } from 'src/logic/safe/store/models/types/gateway'
import { useTxHash } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedGatewayTx/hooks/useTxHash'
import { TxSummary } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedGatewayTx/TxSummary'

import { getExplorerInfo } from 'src/config'
import { formatDate } from 'src/routes/safe/components/Transactions/TxsTable/columns'

const Block = styled.div``

const InlineEthHashInfo = styled(EthHashInfo)`
  display: inline-flex;
`

export const IncomingTxSummary = ({ transaction }: { transaction: TransactionSummary }): ReactElement => {
  const { loading: loadingHash, error: hashError, txHash } = useTxHash(transaction)

  return (
    <TxSummary>
      <Block>
        <Text size="lg" strong as="span">
          Hash:{' '}
        </Text>
        {loadingHash ? (
          <Loader size="xs" />
        ) : hashError ? (
          <Text size="lg">Failed to load hash</Text>
        ) : (
          <InlineEthHashInfo hash={txHash} shortenHash={4} showCopyBtn explorerUrl={getExplorerInfo(txHash)} />
        )}
      </Block>
      <Block>
        <Text size="lg" strong as="span">
          Created:{' '}
        </Text>
        {formatDate(new Date(transaction.timestamp).toISOString())}
      </Block>
    </TxSummary>
  )
}
