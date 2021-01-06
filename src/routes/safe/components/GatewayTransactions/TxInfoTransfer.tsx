import React, { ReactElement, useEffect, useState } from 'react'

import { Transfer } from 'src/logic/safe/store/models/types/gateway.d'
import { useAssetInfo } from './hooks/useAssetInfo'
import { TxInfoDetails } from './TxInfoDetails'

export const TxInfoTransfer = ({ txInfo }: { txInfo: Transfer }): ReactElement | null => {
  const assetInfo = useAssetInfo(txInfo)
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (assetInfo) {
      if (txInfo.direction === 'INCOMING') {
        setTitle(`Received ${assetInfo.amountWithSymbol} from:`)
      } else {
        setTitle(`Send ${assetInfo.amountWithSymbol} to:`)
      }
    }
  }, [assetInfo, txInfo.direction])

  return <TxInfoDetails title={title} address={txInfo.sender} />
}
