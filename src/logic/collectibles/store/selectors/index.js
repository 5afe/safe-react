// @flow
import { NFT_ASSETS_REDUCER_ID, NFT_TOKENS_REDUCER_ID } from '~/logic/collectibles/store/reducer/collectibles'
import type { GlobalState } from '~/store'

export const nftAssetsSelector = (state: GlobalState) => state[NFT_ASSETS_REDUCER_ID]
export const nftTokensSelector = (state: GlobalState) => state[NFT_TOKENS_REDUCER_ID]
