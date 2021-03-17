import { createSelector } from 'reselect'
import { NFTAsset, NFTAssets, NFTToken, NFTTokens } from 'src/logic/collectibles/sources/collectibles.d'

import { AppReduxState } from 'src/store'
import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from 'src/logic/collectibles/store/reducer/collectibles'
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

export const orderedNFTAssets = createSelector(nftTokensSelector, (userNftTokens): NFTToken[] =>
  userNftTokens.sort((a, b) => a.name.localeCompare(b.name)),
)

export const activeNftAssetsListSelector = createSelector(
  nftAssetsListSelector,
  availableNftAssetsAddresses,
  (assets, availableNftAssetsAddresses): NFTAsset[] => {
    return assets.filter(({ address }) => availableNftAssetsAddresses.includes(address))
  },
)
