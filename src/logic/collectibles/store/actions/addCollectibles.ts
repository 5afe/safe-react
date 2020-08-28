import { createAction } from 'redux-actions'

export const ADD_NFT_ASSETS = 'ADD_NFT_ASSETS'
export const ADD_NFT_TOKENS = 'ADD_NFT_TOKENS'

export const addNftAssets = createAction(ADD_NFT_ASSETS, (nftAssets) => ({
  nftAssets,
}))

export const addNftTokens = createAction(ADD_NFT_TOKENS, (nftTokens) => ({
  nftTokens,
}))
