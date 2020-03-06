// @flow
import { type ActionType, handleActions } from 'redux-actions'

import { ADD_NFT_ASSETS, ADD_NFT_TOKENS } from '~/logic/collectibles/store/actions/addCollectibles'
import type { NFTAssets, NFTToken } from '~/routes/safe/components/Balances/Collectibles/types'

export const NFT_ASSETS_REDUCER_ID = 'nftAssets'
export const NFT_TOKENS_REDUCER_ID = 'nftTokens'

export type NFTAssetsState = NFTAssets | null
export type NFTTokensState = NFTToken[] | null

export const nftAssetReducer = handleActions<NFTAssetsState, *>(
  {
    [ADD_NFT_ASSETS]: (state: NFTAssetsState, action: ActionType<Function>): NFTAssetsState => {
      const { nftAssets } = action.payload

      return nftAssets
    },
  },
  null,
)

export const nftTokensReducer = handleActions<NFTTokensState, *>(
  {
    [ADD_NFT_TOKENS]: (state: NFTTokensState, action: ActionType<Function>): NFTTokensState => {
      const { nftTokens } = action.payload

      return nftTokens
    },
  },
  null,
)
