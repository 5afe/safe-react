import { EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway'
import { TxSummary } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedGatewayTx/TxSummary'

import { getExplorerInfo } from 'src/config'
import { formatDate, NOT_AVAILABLE } from 'src/routes/safe/components/Transactions/TxsTable/columns'

const Block = styled.div``

const InlineEthHashInfo = styled(EthHashInfo)`
  display: inline-flex;
`

const InlineText = styled(Text)`
  display: inline-flex;
`

export const IncomingTxSummary = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement => (
  <TxSummary>
    <Block>
      <Text size="lg" strong as="span">
        Hash:{' '}
      </Text>
      {txDetails.txHash ? (
        <InlineEthHashInfo
          hash={txDetails.txHash}
          shortenHash={4}
          showCopyBtn
          explorerUrl={getExplorerInfo(txDetails.txHash)}
        />
      ) : (
        <InlineText size="lg">{NOT_AVAILABLE}</InlineText>
      )}
    </Block>
    <Block>
      <Text size="lg" strong as="span">
        Created:{' '}
      </Text>
      {formatDate(new Date(txDetails.executedAt).toISOString())}
    </Block>
  </TxSummary>
)
