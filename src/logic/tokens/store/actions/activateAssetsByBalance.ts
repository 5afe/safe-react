import { nftAssetsSelector } from 'src/logic/collectibles/store/selectors'
import updateActiveAssets from 'src/logic/safe/store/actions/updateActiveAssets'
import {
  safeActiveAssetsSelectorBySafe,
  safeBlacklistedAssetsSelectorBySafe,
  safesMapSelector,
} from 'src/logic/safe/store/selectors'

const activateAssetsByBalance = (safeAddress) => async (dispatch, getState) => {
  try {
    const state = getState()
    const safes = safesMapSelector(state)

    if (safes.size === 0) {
      return
    }

    const availableAssets = nftAssetsSelector(state)
    const alreadyActiveAssets = safeActiveAssetsSelectorBySafe(safeAddress, safes)
    const blacklistedAssets = safeBlacklistedAssetsSelectorBySafe(safeAddress, safes)

    // active tokens by balance, excluding those already blacklisted and the `null` address
    const activeByBalance = Object.entries(availableAssets)
      .filter((asset) => {
        const { address, numberOfTokens }: any = asset[1]
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
