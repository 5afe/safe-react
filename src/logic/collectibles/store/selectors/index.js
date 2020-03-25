// @flow
import { List, Set } from 'immutable'
import type { Selector } from 'reselect'
import { createSelector } from 'reselect'

import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from '~/logic/collectibles/store/reducer/collectibles'
import type { NFTAssets } from '~/routes/safe/components/Balances/Collectibles/types'
import { safeActiveAssetsSelector } from '~/routes/safe/store/selectors'
import type { GlobalState } from '~/store'

export const nftAssetsSelector = (state: GlobalState) => state[NFT_ASSETS_REDUCER_ID]
export const nftTokensSelector = (state: GlobalState) => state[NFT_TOKENS_REDUCER_ID]

export const nftAssetsListSelector: Selector<GlobalState, NFTAssets, List<NFTAssets>> = createSelector(
  nftAssetsSelector,
  (assets: NFTAssets) => {
    return assets ? List(Object.entries(assets).map(item => item[1])) : List([])
  },
)

export const activeNftAssetsListSelector: Selector<GlobalState, NFTAssets, List<NFTAssets>> = createSelector(
  nftAssetsListSelector,
  safeActiveAssetsSelector,
  (assets: List<NFTAssets>, activeAssetsList: Set<string>) => {
    return assets.filter(asset => activeAssetsList.has(asset.address))
  },
)

export const safeActiveSelectorMap: Selector<GlobalState, NFTAssets, List<NFTAssets>> = createSelector(
  activeNftAssetsListSelector,
  (activeAssets: List<NFTAssets>) => {
    let assetsMap = {}
    activeAssets.forEach(asset => {
      assetsMap[asset.address] = asset
    })
    return assetsMap
  },
)
