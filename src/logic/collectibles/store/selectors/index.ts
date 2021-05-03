import { createSelector } from 'reselect'
import { NFTAsset, NFTAssets, NFTToken, NFTTokens } from 'src/logic/collectibles/sources/collectibles.d'

import { AppReduxState } from 'src/store'
import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from 'src/logic/collectibles/store/reducer/collectibles'
export const nftAssets = (state: AppReduxState): NFTAssets => state[NFT_ASSETS_REDUCER_ID]
export const nftTokens = (state: AppReduxState): NFTTokens => state[NFT_TOKENS_REDUCER_ID]

export const nftAssetsSelector = createSelector(nftAssets, (assets) => assets)

export const nftTokensSelector = createSelector(nftTokens, (tokens) => tokens)

const nftAssetsToListSelector = createSelector(nftAssets, (assets): NFTAsset[] => {
  return assets ? Object.values(assets) : []
})

const nftAssetsAddressFromNftTokensSelector = createSelector(nftTokensSelector, (userNftTokens): string[] => {
  const addresses = userNftTokens.map((nftToken) => nftToken.assetAddress)
  const uniqueAddresses = new Set(addresses)
  return Array.from(uniqueAddresses)
})

export const orderedNFTAssets = createSelector(nftTokensSelector, (userNftTokens): NFTToken[] =>
  userNftTokens.sort((a, b) => a.name.localeCompare(b.name)),
)

export const nftAssetsFromNftTokensSelector = createSelector(
  nftAssetsToListSelector,
  nftAssetsAddressFromNftTokensSelector,
  (nftAssets, nftAssetsFromNftTokens): NFTAsset[] => {
    return nftAssets
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(({ address }) => nftAssetsFromNftTokens.includes(address))
  },
)
