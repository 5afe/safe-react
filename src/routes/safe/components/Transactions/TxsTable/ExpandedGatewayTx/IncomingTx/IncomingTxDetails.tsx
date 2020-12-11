import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { AddressInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import { Transfer } from 'src/logic/safe/store/models/types/gateway'
import { getIncomingTxAmount } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import { TxDetails } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedGatewayTx/TxDetails'

// TODO: this is kept due to backwards compatibility. But it may change in following releases.
export const TRANSACTIONS_DESC_INCOMING_TEST_ID = 'tx-description-incoming'

const Block = styled.div``

export const IncomingTxDetails = ({ txInfo }: { txInfo: Transfer }): ReactElement => (
  <TxDetails>
    <Block data-testid={TRANSACTIONS_DESC_INCOMING_TEST_ID}>
      <Text size="lg" strong>
        Received {getIncomingTxAmount(txInfo, false)} from:
      </Text>
      <AddressInfo address={txInfo.sender} cut={0} />
    </Block>
  </TxDetails>
)
