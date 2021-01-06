import React, { ReactElement } from 'react'

import { Transfer } from 'src/logic/safe/store/models/types/gateway.d'
import { useAssetInfo } from './hooks/useAssetInfo'
import { TxInfoDetails } from './TxInfoDetails'

export const TxInfoTransfer = ({ txInfo }: { txInfo: Transfer }): ReactElement | null => {
  const assetInfo = useAssetInfo(txInfo)

  const title =
    txInfo.direction === 'INCOMING'
      ? `Received ${assetInfo.amountWithSymbol} from:`
      : `Send ${assetInfo.amountWithSymbol} to:`

  return <TxInfoDetails title={title} address={txInfo.sender} />
}
