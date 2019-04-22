// @flow
import { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'
import type { Store, AnyAction } from 'redux'
import { type GlobalState } from '~/store/'
import { saveSafes, setOwners } from '~/logic/safe/utils'
import { safesMapSelector } from '~/routes/safeList/store/selectors'
import { getActiveTokensAddressesForAllSafes } from '~/routes/safe/store/selectors'
import { tokensSelector } from '~/logic/tokens/store/selectors'
import type { Token } from '~/logic/tokens/store/model/token'
import { saveActiveTokens } from '~/logic/tokens/utils/tokensStorage'

const watchedActions = [ADD_SAFE, UPDATE_SAFE]

const safeStorageMware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()
    const safes = safesMapSelector(state)
    saveSafes(safes.toJSON())

    // recalculate active tokens
    if (action.payload.activeTokens) {
      const tokens = tokensSelector(state)
      const activeTokenAddresses = getActiveTokensAddressesForAllSafes(state)

      const activeTokens = tokens.withMutations((map) => {
        map.forEach((token: Token) => {
          if (!activeTokenAddresses.has(token.address)) {
            map.remove(token.address)
          }
        })
      })

      saveActiveTokens(activeTokens)
    }

    if (action.type === ADD_SAFE) {
      const { safe } = action.payload
      setOwners(safe.address, safe.owners)
    }
  }

  return handledAction
}

export default safeStorageMware
