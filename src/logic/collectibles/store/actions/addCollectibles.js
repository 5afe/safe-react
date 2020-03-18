// @flow
import { createAction } from 'redux-actions'

import type { NFTAssets, NFTToken } from '~/routes/safe/components/Balances/Collectibles/types'

export const ADD_NFT_ASSETS = 'ADD_NFT_ASSETS'
export const ADD_NFT_TOKENS = 'ADD_NFT_TOKENS'

export const addNftAssets = createAction<string, *, *>(ADD_NFT_ASSETS, (nftAssets: NFTAssets) => ({
  nftAssets,
}))

export const addNftTokens = createAction<string, *, *>(ADD_NFT_TOKENS, (nftTokens: NFTToken[]) => ({
  nftTokens,
}))
