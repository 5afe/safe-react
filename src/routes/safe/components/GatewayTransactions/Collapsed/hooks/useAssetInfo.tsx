import { useEffect, useState } from 'react'

import { getNetworkInfo } from 'src/config'
import { Transfer } from 'src/logic/safe/store/models/types/gateway'
import { getTxAmount } from 'src/routes/safe/components/GatewayTransactions/utils'
import { NOT_AVAILABLE } from 'src/routes/safe/components/Transactions/TxsTable/columns'

type TokenTransferAsset = {
  name: string
  logoUri: string
  directionSign: '+' | '-' | ''
  amountWithSymbol: string
  type: string
}

const defaultAssetValues: TokenTransferAsset = {
  name: NOT_AVAILABLE,
  logoUri: NOT_AVAILABLE,
  directionSign: '',
  amountWithSymbol: NOT_AVAILABLE,
  type: 'UNKNOWN',
}

export const useAssetInfo = (txInfo: Transfer): TokenTransferAsset => {
  const [asset, setAsset] = useState<TokenTransferAsset>(defaultAssetValues)
  const { direction, transferInfo } = txInfo
  const amountWithSymbol = getTxAmount(txInfo)

  useEffect(() => {
    const directionSign = direction === 'INCOMING' ? '+' : '-'

    switch (transferInfo.type) {
      case 'ERC20': {
        setAsset({
          name: transferInfo.tokenName ?? defaultAssetValues.name,
          logoUri: transferInfo.logoUri ?? defaultAssetValues.logoUri,
          directionSign,
          amountWithSymbol,
          type: transferInfo.type,
        })
        break
      }
      case 'ERC721': {
        setAsset({
          name: transferInfo.tokenName ?? defaultAssetValues.name,
          logoUri: transferInfo.logoUri ?? defaultAssetValues.logoUri,
          directionSign: directionSign,
          amountWithSymbol,
          type: transferInfo.type,
        })
        break
      }
      case 'ETHER': {
        const { nativeCoin } = getNetworkInfo()

        setAsset({
          name: nativeCoin.name ?? defaultAssetValues.name,
          logoUri: nativeCoin.logoUri ?? defaultAssetValues.logoUri,
          directionSign: directionSign,
          amountWithSymbol,
          type: transferInfo.type,
        })
        break
      }
    }
  }, [direction, transferInfo, amountWithSymbol])

  return asset
}
