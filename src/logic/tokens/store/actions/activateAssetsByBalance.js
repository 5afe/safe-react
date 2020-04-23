// @flow

import type { Dispatch as ReduxDispatch } from 'redux'

import fetchCollectibles from '~/logic/collectibles/store/actions/fetchCollectibles'
import { nftAssetsSelector } from '~/logic/collectibles/store/selectors'
import updateActiveAssets from '~/routes/safe/store/actions/updateActiveAssets'
import {
  safeActiveAssetsSelectorBySafe,
  safeBlacklistedAssetsSelectorBySafe,
  safesMapSelector,
} from '~/routes/safe/store/selectors'
import { type GetState, type GlobalState } from '~/store'

const activateAssetsByBalance = (safeAddress: string) => async (
  dispatch: ReduxDispatch<GlobalState>,
  getState: GetState,
) => {
  try {
    const state = getState()
    const safes = safesMapSelector(state)

    if (safes.size === 0) {
      return
    }

    await dispatch(fetchCollectibles())
    const availableAssets = nftAssetsSelector(state)
    const alreadyActiveAssets = safeActiveAssetsSelectorBySafe(safeAddress, safes)
    const blacklistedAssets = safeBlacklistedAssetsSelectorBySafe(safeAddress, safes)

    // active tokens by balance, excluding those already blacklisted and the `null` address
    const activeByBalance = Object.entries(availableAssets)
      .filter((asset) => {
        const { address, numberOfTokens } = asset[1]
        return address !== null && !blacklistedAssets.has(address) && numberOfTokens > 0
      })
      .map((asset) => {
        return asset[0]
      })

    // need to persist those already active assets, despite its balances
    const activeAssets = alreadyActiveAssets.union(activeByBalance)

    // update list of active tokens
    dispatch(updateActiveAssets(safeAddress, activeAssets))
  } catch (err) {
    console.error('Error fetching active assets list', err)
  }

  return null
}

export default activateAssetsByBalance
