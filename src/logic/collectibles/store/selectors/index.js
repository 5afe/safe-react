// @flow
import { List } from 'immutable'
import type { Selector } from 'reselect'
import { createSelector } from 'reselect'

import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from '~/logic/collectibles/store/reducer/collectibles'
import type { NFTAssets } from '~/routes/safe/components/Balances/Collectibles/types'
import type { GlobalState } from '~/store'

export const nftAssetsSelector = (state: GlobalState) => state[NFT_ASSETS_REDUCER_ID]
export const nftTokensSelector = (state: GlobalState) => state[NFT_TOKENS_REDUCER_ID]

export const nftAssetsListSelector: Selector<GlobalState, NFTAssets, List<NFTAssets>> = createSelector(
  nftAssetsSelector,
  (assets: NFTAssets) => {
    const list = Object.entries(assets).map(item => item[1])
    return List(list)
  },
)
