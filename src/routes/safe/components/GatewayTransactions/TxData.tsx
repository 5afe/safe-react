import React, { ReactElement } from 'react'

import { ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { HexEncodedData } from './HexEncodedData'
import { MethodDetails } from './MethodDetails'
import { MultiSendDetails } from './MultiSendDetails'

type TxDataProps = {
  txData: ExpandedTxDetails['txData']
}

export const TxData = ({ txData }: TxDataProps): ReactElement | null => {
  // nothing to render
  if (!txData) {
    return null
  }

  // unknown tx information
  if (!txData.dataDecoded) {
    // no hex data, nothing to render
    if (!txData.hexData) {
      return null
    }

    // we render the hex encoded data
    return <HexEncodedData hexData={txData.hexData} />
  }

  // known data and particularly `multiSend` data type
  if (txData.dataDecoded.method === 'multiSend') {
    return <MultiSendDetails txData={txData} />
  }

  // we render the decoded data
  return <MethodDetails data={txData.dataDecoded} />
}
