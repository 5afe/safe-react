import { List, Map } from 'immutable'
import { createSelector } from 'reselect'

import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from 'src/logic/collectibles/store/reducer/collectibles'
import { safeActiveAssetsSelector } from 'src/routes/safe/store/selectors'
import { NFTAssets, NFTTokens, NFTAsset } from '../../sources/OpenSea'

export const nftAssetsSelector = (state: Map<string, unknown>): NFTAssets => state[NFT_ASSETS_REDUCER_ID]
export const nftTokensSelector = (state: Map<string, unknown>): NFTTokens => state[NFT_TOKENS_REDUCER_ID]

export const nftAssetsListSelector = createSelector(
  nftAssetsSelector,
  (assets): List<NFTAsset> => {
    return assets ? List(Object.values(assets)) : List()
  },
)

export const activeNftAssetsListSelector = createSelector(
  nftAssetsListSelector,
  safeActiveAssetsSelector,
  (assets, activeAssetsList): List<NFTAsset> => {
    return assets.filter(({ address }) => activeAssetsList.has(address))
  },
)

export const safeActiveSelectorMap = createSelector(
  activeNftAssetsListSelector,
  (activeAssets): Record<string, NFTAsset> => {
    const assetsMap = {}

    activeAssets.forEach((asset) => {
      assetsMap[asset.address] = asset
    })

    return assetsMap
  },
)
