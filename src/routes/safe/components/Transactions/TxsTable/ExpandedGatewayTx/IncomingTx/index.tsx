import React, { ReactElement } from 'react'

import { ExpandedTxDetails, Transfer } from 'src/logic/safe/store/models/types/gateway'
import { IncomingTxDetails } from './IncomingTxDetails'
import { IncomingTxSummary } from './IncomingTxSummary'

export const IncomingTx = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement => (
  <>
    <IncomingTxSummary txDetails={txDetails} />
    <IncomingTxDetails txInfo={txDetails.txInfo as Transfer} />
  </>
)
