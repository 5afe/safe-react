import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { TxData as LegacyTxData } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/TxDescription/CustomDescription'

type TxDataProps = {
  txData: ExpandedTxDetails['txData']
}

export const TxData = ({ txData }: TxDataProps): ReactElement | null => (
  <>
    {txData?.hexData && (
      <div className="tx-hexData">
        <Text size="md" strong>
          Data (hex encoded):
        </Text>
        <LegacyTxData data={txData.hexData} />
      </div>
    )}
    <div className="tx-dataDecoded">
      <pre>{JSON.stringify(txData, null, 2)}</pre>
    </div>
  </>
)
