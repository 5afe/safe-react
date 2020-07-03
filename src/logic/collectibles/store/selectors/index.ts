import { List } from 'immutable'
import { createSelector } from 'reselect'
import { NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/OpenSea'

import { AppReduxState } from 'src/store'
import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from 'src/logic/collectibles/store/reducer/collectibles'
import { safeActiveAssetsSelector } from 'src/routes/safe/store/selectors'

export const nftAssetsSelector = (state: AppReduxState): NFTAssets => state[NFT_ASSETS_REDUCER_ID]
export const nftTokensSelector = (state: AppReduxState): NFTTokens => state[NFT_TOKENS_REDUCER_ID]

export const nftAssetsListSelector = createSelector(nftAssetsSelector, (assets) => {
  return assets ? List(Object.entries(assets).map((item) => item[1])) : List([])
})

export const activeNftAssetsListSelector = createSelector(
  nftAssetsListSelector,
  safeActiveAssetsSelector,
  (assets, activeAssetsList) => {
    return assets.filter((asset: any) => activeAssetsList.has(asset.address))
  },
)

export const safeActiveSelectorMap = createSelector(activeNftAssetsListSelector, (activeAssets) => {
  const assetsMap = {}
  activeAssets.forEach((asset: any) => {
    assetsMap[asset.address] = asset
  })
  return assetsMap
})
