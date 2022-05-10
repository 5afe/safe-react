import {
  Custom,
  SettingsChange,
  TransactionInfo,
  Transfer,
  TransactionTokenType,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'

import { getNativeCurrency } from 'src/config'
import { isCustomTxInfo, isSettingsChangeTxInfo, isTransferTxInfo } from 'src/logic/safe/store/models/types/gateway.d'
import { getTokenIdLabel, getTxAmount, NOT_AVAILABLE } from 'src/routes/safe/components/Transactions/TxList/utils'

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
      const { direction, transferInfo } = txInfo as Transfer
      const directionSign = direction === 'INCOMING' ? '+' : '-'

      switch (transferInfo.type) {
        case TransactionTokenType.ERC20: {
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
        case TransactionTokenType.ERC721: {
          setAsset({
            type: 'Transfer',
            name: `${transferInfo.tokenName ?? defaultTokenTransferAsset.name} ${getTokenIdLabel(transferInfo)}`,
            logoUri: transferInfo.logoUri ?? defaultTokenTransferAsset.logoUri,
            directionSign: directionSign,
            amountWithSymbol,
            tokenType: transferInfo.type,
          })
          break
        }
        case TransactionTokenType.NATIVE_COIN: {
          const nativeCurrency = getNativeCurrency()

          setAsset({
            type: 'Transfer',
            name: nativeCurrency.name ?? defaultTokenTransferAsset.name,
            logoUri: nativeCurrency.logoUri ?? defaultTokenTransferAsset.logoUri,
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
      setAsset(txInfo as SettingsChange)
      return
    }

    if (isCustomTxInfo(txInfo)) {
      setAsset(txInfo as Custom)
    }
  }, [txInfo, amountWithSymbol])

  return asset
}
