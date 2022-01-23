import { Transfer, TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'
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

  const makeTitle = (txDirection: string, amountWithSymbol: string) => (
    <Text size="xl" as="span">
      {txDirection === TransferDirection.INCOMING ? 'Received ' : 'Sent '}
      <Text size="xl" as="span" strong>
        {amountWithSymbol}
      </Text>
      {txDirection === TransferDirection.INCOMING ? ' from:' : ' to:'}
    </Text>
  )

  useEffect(() => {
    if (assetInfo && assetInfo.type === 'Transfer') {
      const txDirection = txInfo.direction.toUpperCase()
      setDetails({
        title: makeTitle(txDirection, assetInfo.amountWithSymbol),
        address: txDirection === TransferDirection.INCOMING ? txInfo.sender.value : txInfo.recipient.value,
        name:
          txDirection === TransferDirection.INCOMING
            ? txInfo.sender.name || undefined
            : txInfo.recipient.name || undefined,
      })
    }
  }, [assetInfo, txInfo.direction, txInfo.recipient, txInfo.sender])

  return details ? <TxInfoDetails {...details} isTransferType txInfo={txInfo} /> : null
}
