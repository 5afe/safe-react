import { handleActions } from 'redux-actions'

import { ADD_NFT_ASSETS, ADD_NFT_TOKENS } from 'src/logic/collectibles/store/actions/addCollectibles'
import { NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/collectibles'

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

type NFTTokensPayload = { nftTokens: NFTTokens }

export const nftTokensReducer = handleActions<NFTTokens, NFTTokensPayload>(
  {
    [ADD_NFT_TOKENS]: (state, action) => {
      const { nftTokens } = action.payload

      return nftTokens
    },
  },
  { items: [], loaded: false },
)
