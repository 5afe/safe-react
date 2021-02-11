import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { TxData as LegacyTxData } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/TxDescription/CustomDescription'

export const HexEncodedData = ({ hexData }: { hexData: string }): ReactElement => (
  <div className="tx-hexData">
    <Text size="xl" strong>
      Data (hex encoded):
    </Text>
    <LegacyTxData data={hexData} />
  </div>
)
