import { Transfer } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, useEffect, useState } from 'react'

import { useAssetInfo } from './hooks/useAssetInfo'
import { TxInfoDetails } from './TxInfoDetails'

export const TxInfoTransfer = ({ txInfo }: { txInfo: Transfer }): ReactElement | null => {
  const assetInfo = useAssetInfo(txInfo)
  const [details, setDetails] = useState<{ title: string; address: string } | undefined>()

  useEffect(() => {
    if (assetInfo && assetInfo.type === 'Transfer') {
      if (txInfo.direction === 'INCOMING') {
        setDetails({ title: `Received ${assetInfo.amountWithSymbol} from:`, address: txInfo.sender.value })
      } else {
        setDetails({ title: `Send ${assetInfo.amountWithSymbol} to:`, address: txInfo.recipient.value })
      }
    }
  }, [assetInfo, txInfo.direction, txInfo.recipient, txInfo.sender])

  return details ? (
    <TxInfoDetails title={details.title} address={details.address} isTransferType txInfo={txInfo} />
  ) : null
}
