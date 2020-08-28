import { handleActions } from 'redux-actions'

import { ADD_NFT_ASSETS, ADD_NFT_TOKENS } from 'src/logic/collectibles/store/actions/addCollectibles'

export const NFT_ASSETS_REDUCER_ID = 'nftAssets'
export const NFT_TOKENS_REDUCER_ID = 'nftTokens'

export const nftAssetReducer = handleActions(
  {
    [ADD_NFT_ASSETS]: (state, action) => {
      const { nftAssets } = action.payload

      return nftAssets
    },
  },
  {},
)

export const nftTokensReducer = handleActions(
  {
    [ADD_NFT_TOKENS]: (state, action) => {
      const { nftTokens } = action.payload

      return nftTokens
    },
  },
  [],
)
