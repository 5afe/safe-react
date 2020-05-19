//
import { List } from 'immutable'
import { createSelector } from 'reselect'

import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from 'logic/collectibles/store/reducer/collectibles'
import { safeActiveAssetsSelector } from 'routes/safe/store/selectors'

export const nftAssetsSelector = (state) => state[NFT_ASSETS_REDUCER_ID]
export const nftTokensSelector = (state) => state[NFT_TOKENS_REDUCER_ID]

export const nftAssetsListSelector = createSelector(nftAssetsSelector, (assets) => {
  return assets ? List(Object.entries(assets).map((item) => item[1])) : List([])
})

export const activeNftAssetsListSelector = createSelector(
  nftAssetsListSelector,
  safeActiveAssetsSelector,
  (assets, activeAssetsList) => {
    return assets.filter((asset) => activeAssetsList.has(asset.address))
  },
)

export const safeActiveSelectorMap = createSelector(activeNftAssetsListSelector, (activeAssets) => {
  const assetsMap = {}
  activeAssets.forEach((asset) => {
    assetsMap[asset.address] = asset
  })
  return assetsMap
})
