import { handleActions } from 'redux-actions'

import { ADD_NFT_ASSETS, ADD_NFT_TOKENS, SET_NFT_LOADED } from 'src/logic/collectibles/store/actions/addCollectibles'
import { NFTAssets, NFTTokens, NFTTokensStore } from 'src/logic/collectibles/sources/collectibles'
import { Action } from 'redux-actions'

export const NFT_ASSETS_REDUCER_ID = 'nftAssets'
export const NFT_TOKENS_REDUCER_ID = 'nftTokens'

type NFTAssetsPayload = { nftAssets: NFTAssets }

export const nftAssetReducer = handleActions<NFTAssets, NFTAssetsPayload>(
  {
    [ADD_NFT_ASSETS]: (state, action) => {
      const { nftAssets } = action.payload

      return nftAssets
    },
  },
  {},
)

type AddNftTokensPayload = { nftTokens: NFTTokens }
type SetNftLoadedPayload = boolean
type NFTTokensPayload = AddNftTokensPayload | SetNftLoadedPayload

export const nftTokensDefaultState: NFTTokensStore = {
  items: [],
  loaded: false,
}

export const nftTokensReducer = handleActions<NFTTokensStore, NFTTokensPayload>(
  {
    [ADD_NFT_TOKENS]: (state, action: Action<AddNftTokensPayload>) => {
      const { nftTokens } = action.payload

      return {
        ...state,
        items: nftTokens,
      }
    },

    [SET_NFT_LOADED]: (state, action: Action<SetNftLoadedPayload>) => {
      const loaded = action.payload
      return {
        ...state,
        loaded,
      }
    },
  },
  nftTokensDefaultState,
)
