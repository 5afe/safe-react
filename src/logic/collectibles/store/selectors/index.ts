import { createSelector } from 'reselect'
import { NFTAsset, NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/OpenSea'

import { AppReduxState } from 'src/store'
import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from 'src/logic/collectibles/store/reducer/collectibles'
import { safeActiveAssetsSelector } from 'src/routes/safe/store/selectors'

export const nftAssetsSelector = (state: AppReduxState): NFTAssets => state[NFT_ASSETS_REDUCER_ID]
export const nftTokensSelector = (state: AppReduxState): NFTTokens => state[NFT_TOKENS_REDUCER_ID]

export const nftAssetsListSelector = createSelector(nftAssetsSelector, (assets): NFTAsset[] => {
  return assets ? Object.values(assets) : []
})

export const activeNftAssetsListSelector = createSelector(
  nftAssetsListSelector,
  safeActiveAssetsSelector,
  (assets, activeAssetsList): NFTAsset[] => {
    return assets.filter(({ address }) => activeAssetsList.has(address))
  },
)

export const safeActiveSelectorMap = createSelector(
  activeNftAssetsListSelector,
  (activeAssets): NFTAssets => {
    return activeAssets.reduce((acc, asset) => {
      acc[asset.address] = asset
      return acc
    }, {})
  },
)
