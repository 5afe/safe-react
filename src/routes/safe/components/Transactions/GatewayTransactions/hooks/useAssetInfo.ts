import { useEffect, useState } from 'react'

import { getNetworkInfo } from 'src/config'
import {
  Custom,
  isCustomTxInfo,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  SettingsChange,
  TransactionInfo,
} from 'src/logic/safe/store/models/types/gateway.d'
import { getTxAmount } from 'src/routes/safe/components/Transactions/GatewayTransactions/utils'
import { NOT_AVAILABLE } from 'src/routes/safe/components/Transactions/TxsTable/columns'

export type TokenTransferAsset = {
  type: 'Transfer'
  name: string
  logoUri: string
  directionSign: '+' | '-' | ''
  amountWithSymbol: string
  tokenType: string
}

export type AssetInfo = TokenTransferAsset | SettingsChange | Custom

export const isTokenTransferAsset = (value: AssetInfo): value is TokenTransferAsset => {
  return value.type === 'Transfer'
}

const defaultTokenTransferAsset: TokenTransferAsset = {
  type: 'Transfer',
  name: NOT_AVAILABLE,
  logoUri: NOT_AVAILABLE,
  directionSign: '',
  amountWithSymbol: NOT_AVAILABLE,
  tokenType: 'UNKNOWN',
}

export const useAssetInfo = (txInfo: TransactionInfo): AssetInfo | undefined => {
  const [asset, setAsset] = useState<AssetInfo>()
  const amountWithSymbol = getTxAmount(txInfo)

  useEffect(() => {
    if (isTransferTxInfo(txInfo)) {
      const { direction, transferInfo } = txInfo
      const directionSign = direction === 'INCOMING' ? '+' : '-'

      switch (transferInfo.type) {
        case 'ERC20': {
          setAsset({
            type: 'Transfer',
            name: transferInfo.tokenName ?? defaultTokenTransferAsset.name,
            logoUri: transferInfo.logoUri ?? defaultTokenTransferAsset.logoUri,
            directionSign,
            amountWithSymbol,
            tokenType: transferInfo.type,
          })
          break
        }
        case 'ERC721': {
          setAsset({
            type: 'Transfer',
            name: transferInfo.tokenName ?? defaultTokenTransferAsset.name,
            logoUri: transferInfo.logoUri ?? defaultTokenTransferAsset.logoUri,
            directionSign: directionSign,
            amountWithSymbol,
            tokenType: transferInfo.type,
          })
          break
        }
        case 'ETHER': {
          const { nativeCoin } = getNetworkInfo()

          setAsset({
            type: 'Transfer',
            name: nativeCoin.name ?? defaultTokenTransferAsset.name,
            logoUri: nativeCoin.logoUri ?? defaultTokenTransferAsset.logoUri,
            directionSign: directionSign,
            amountWithSymbol,
            tokenType: transferInfo.type,
          })
          break
        }
      }
      return
    }

    if (isSettingsChangeTxInfo(txInfo)) {
      setAsset(txInfo)
      return
    }

    if (isCustomTxInfo(txInfo)) {
      setAsset(txInfo)
    }
  }, [txInfo, amountWithSymbol])

  return asset
}
