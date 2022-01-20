import { Transfer } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, useEffect, useState } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'

import { useAssetInfo } from './hooks/useAssetInfo'
import { TxInfoDetails } from './TxInfoDetails'

type Details = {
  title: string | ReactElement
  address: string
  name: string | undefined // AddressEx returns null if unknown
}

export const TxInfoTransfer = ({ txInfo }: { txInfo: Transfer }): ReactElement | null => {
  const assetInfo = useAssetInfo(txInfo)
  const [details, setDetails] = useState<Details | undefined>()

  useEffect(() => {
    if (assetInfo && assetInfo.type === 'Transfer') {
      if (txInfo.direction.toUpperCase() === 'INCOMING') {
        setDetails({
          title: (
            <Text size="xl" as="span">
              Received{' '}
              <Text size="xl" as="span" strong>
                {assetInfo.amountWithSymbol}
              </Text>{' '}
              from:
            </Text>
          ),
          address: txInfo.sender.value,
          name: txInfo.sender.name || undefined,
        })
      } else {
        setDetails({
          title: (
            <Text size="xl" as="span">
              Sent{' '}
              <Text size="xl" as="span" strong>
                {assetInfo.amountWithSymbol}
              </Text>{' '}
              to:
            </Text>
          ),
          address: txInfo.recipient.value,
          name: txInfo.recipient.name || undefined,
        })
      }
    }
  }, [assetInfo, txInfo.direction, txInfo.recipient, txInfo.sender])

  return details ? <TxInfoDetails {...details} isTransferType txInfo={txInfo} /> : null
}
