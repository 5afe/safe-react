import { useEffect, useState } from 'react'

import { getNetworkInfo } from 'src/config'
import { TokenTransferAmountProps } from 'src/routes/safe/components/GatewayTransactions/Row/TokenTransferAmount'
import { NOT_AVAILABLE } from 'src/routes/safe/components/Transactions/TxsTable/columns'

type TokenTransferAsset = {
  name: string
  logoUri: string
  amountWithSymbol: string
  type: string
}

const defaultAssetValues: TokenTransferAsset = {
  name: NOT_AVAILABLE,
  logoUri: NOT_AVAILABLE,
  amountWithSymbol: NOT_AVAILABLE,
  type: 'UNKNOWN',
}

export const useAssetInfo = ({
  direction,
  transferInfo,
  amountWithSymbol,
}: TokenTransferAmountProps): TokenTransferAsset => {
  const [asset, setAsset] = useState<TokenTransferAsset>(defaultAssetValues)

  useEffect(() => {
    const directionSign = direction === 'INCOMING' ? '+' : '-'

    switch (transferInfo.type) {
      case 'ERC20': {
        setAsset({
          name: transferInfo.tokenName ?? defaultAssetValues.name,
          logoUri: transferInfo.logoUri ?? defaultAssetValues.logoUri,
          amountWithSymbol: `${directionSign}${amountWithSymbol}`,
          type: transferInfo.type,
        })
        break
      }
      case 'ERC721': {
        setAsset({
          name: transferInfo.tokenName ?? defaultAssetValues.name,
          logoUri: transferInfo.logoUri ?? defaultAssetValues.logoUri,
          amountWithSymbol: `${directionSign}${amountWithSymbol}`,
          type: transferInfo.type,
        })
        break
      }
      case 'ETHER': {
        const { nativeCoin } = getNetworkInfo()

        setAsset({
          name: nativeCoin.name ?? defaultAssetValues.name,
          logoUri: nativeCoin.logoUri ?? defaultAssetValues.logoUri,
          amountWithSymbol: `${directionSign}${amountWithSymbol}`,
          type: transferInfo.type,
        })
        break
      }
    }
  }, [direction, transferInfo, amountWithSymbol])

  return asset
}
