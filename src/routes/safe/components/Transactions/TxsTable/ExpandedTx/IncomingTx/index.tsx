import React, { ReactElement } from 'react'

import { formatDate } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import Bold from 'src/components/layout/Bold'
import Paragraph from 'src/components/layout/Paragraph'

export const IncomingTx = ({ timestamp }: { timestamp: number }): ReactElement => (
  <Paragraph noMargin>
    <Bold>Created: </Bold>
    {formatDate(new Date(timestamp).toISOString())}
  </Paragraph>
)
