import { createSelector } from 'reselect'
import { NFTAsset, NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/collectibles.d'

import { AppReduxState } from 'src/store'
import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from 'src/logic/collectibles/store/reducer/collectibles'
import { safeActiveAssetsSelector } from 'src/logic/safe/store/selectors'

export const nftAssets = (state: AppReduxState): NFTAssets => state[NFT_ASSETS_REDUCER_ID]
export const nftTokens = (state: AppReduxState): NFTTokens => state[NFT_TOKENS_REDUCER_ID]

export const nftAssetsSelector = createSelector(nftAssets, (assets) => assets)

export const nftTokensSelector = createSelector(nftTokens, (tokens) => tokens)

export const nftAssetsListSelector = createSelector(nftAssets, (assets): NFTAsset[] => {
  return assets ? Object.values(assets) : []
})

export const availableNftAssetsAddresses = createSelector(nftTokensSelector, (userNftTokens): string[] => {
  return Array.from(new Set(userNftTokens.map((nftToken) => nftToken.assetAddress)))
})

export const activeNftAssetsListSelector = createSelector(
  nftAssetsListSelector,
  safeActiveAssetsSelector,
  availableNftAssetsAddresses,
  (assets, activeAssetsList, availableNftAssetsAddresses): NFTAsset[] => {
    return assets
      .filter(({ address }) => activeAssetsList.has(address))
      .filter(({ address }) => availableNftAssetsAddresses.includes(address))
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
