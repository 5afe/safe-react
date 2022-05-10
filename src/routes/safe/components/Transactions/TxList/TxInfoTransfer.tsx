import { TransactionStatus, Transfer, TransferDirection } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, useEffect, useState } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'

import { AssetInfo, TokenTransferAsset, useAssetInfo } from './hooks/useAssetInfo'
import { TxInfoDetails } from './TxInfoDetails'
import { isTxQueued } from 'src/logic/safe/store/models/types/gateway.d'

export const isTransferAssetInfo = (value?: AssetInfo): value is TokenTransferAsset => {
  return value?.type === 'Transfer'
}

const makeTitle = (txDirection: string, amountWithSymbol: string, txStatus: TransactionStatus) => (
  <Text size="xl" as="span">
    {txDirection === TransferDirection.INCOMING ? 'Received' : isTxQueued(txStatus) ? 'Send' : 'Sent'}{' '}
    <Text size="xl" as="span" strong>
      {amountWithSymbol}
    </Text>
    {txDirection === TransferDirection.INCOMING ? ' from:' : ' to:'}
  </Text>
)

type Details = {
  title: string | ReactElement
  address: string
  name: string | undefined // AddressEx returns null if unknown
}

export const TxInfoTransfer = ({
  txInfo,
  txStatus,
}: {
  txInfo: Transfer
  txStatus: TransactionStatus
}): ReactElement | null => {
  const assetInfo = useAssetInfo(txInfo)
  const [details, setDetails] = useState<Details | undefined>()

  useEffect(() => {
    if (isTransferAssetInfo(assetInfo)) {
      const txDirection = txInfo.direction.toUpperCase()
      setDetails({
        title: makeTitle(txDirection, assetInfo.amountWithSymbol, txStatus),
        address: txDirection === TransferDirection.INCOMING ? txInfo.sender.value : txInfo.recipient.value,
        name: (txDirection === TransferDirection.INCOMING ? txInfo.sender.name : txInfo.recipient.name) || undefined,
      })
    }
  }, [assetInfo, txInfo.direction, txInfo.recipient, txInfo.sender, txStatus])

  return details ? <TxInfoDetails {...details} isTransferType txInfo={txInfo} /> : null
}
