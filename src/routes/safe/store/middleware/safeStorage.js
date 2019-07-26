// @flow
import type { Store, AnyAction } from 'redux'
import { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'
import { REMOVE_SAFE } from '~/routes/safe/store/actions/removeSafe'
import { ADD_SAFE_OWNER } from '~/routes/safe/store/actions/addSafeOwner'
import { REMOVE_SAFE_OWNER } from '~/routes/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from '~/routes/safe/store/actions/replaceSafeOwner'
import { EDIT_SAFE_OWNER } from '~/routes/safe/store/actions/editSafeOwner'
import { type GlobalState } from '~/store/'
import { saveSafes, setOwners, removeOwners } from '~/logic/safe/utils'
import { safesMapSelector } from '~/routes/safeList/store/selectors'
import { getActiveTokensAddressesForAllSafes } from '~/routes/safe/store/selectors'
import { tokensSelector } from '~/logic/tokens/store/selectors'
import type { Token } from '~/logic/tokens/store/model/token'
import { makeOwner } from '~/routes/safe/store/models/owner'
import { saveActiveTokens } from '~/logic/tokens/utils/tokensStorage'
import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from '~/routes/safe/store/actions/activateTokenForAllSafes'

const watchedActions = [
  ADD_SAFE,
  UPDATE_SAFE,
  REMOVE_SAFE,
  ADD_SAFE_OWNER,
  REMOVE_SAFE_OWNER,
  REPLACE_SAFE_OWNER,
  EDIT_SAFE_OWNER,
  ACTIVATE_TOKEN_FOR_ALL_SAFES,
]

const safeStorageMware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()
    const safes = safesMapSelector(state)
    await saveSafes(safes.toJSON())

    switch (action.type) {
      case ACTIVATE_TOKEN_FOR_ALL_SAFES: {
        let { activeTokens } = action.payload
        if (activeTokens) {
          const tokens = tokensSelector(state)
          const activeTokenAddresses = getActiveTokensAddressesForAllSafes(state)

          activeTokens = tokens.withMutations((map) => {
            map.forEach((token: Token) => {
              if (!activeTokenAddresses.has(token.address)) {
                map.remove(token.address)
              }
            })
          })

          saveActiveTokens(activeTokens)
        }
        break
      }
      case ADD_SAFE: {
        const { safe } = action.payload
        setOwners(safe.address, safe.owners)
        break
      }
      case UPDATE_SAFE: {
        const { safeAddress, owners } = action.payload
        if (safeAddress && owners) {
          setOwners(safeAddress, owners)
        }
        break
      }
      case REMOVE_SAFE: {
        const { safeAddress } = action.payload
        await removeOwners(safeAddress)
        break
      }
      case ADD_SAFE_OWNER: {
        const { safeAddress, ownerAddress, ownerName } = action.payload
        const { owners } = safes.get(safeAddress)
        setOwners(safeAddress, owners.push(makeOwner({ address: ownerAddress, name: ownerName })))
        break
      }
      case REMOVE_SAFE_OWNER: {
        const { safeAddress, ownerAddress } = action.payload
        const { owners } = safes.get(safeAddress)
        setOwners(safeAddress, owners.filter(o => o.address.toLowerCase() !== ownerAddress.toLowerCase()))
        break
      }
      case REPLACE_SAFE_OWNER: {
        const {
          safeAddress, ownerAddress, ownerName, oldOwnerAddress,
        } = action.payload
        const { owners } = safes.get(safeAddress)
        setOwners(
          safeAddress,
          owners
            .filter(o => o.address.toLowerCase() !== oldOwnerAddress.toLowerCase())
            .push(makeOwner({ address: ownerAddress, name: ownerName })),
        )
        break
      }
      case EDIT_SAFE_OWNER: {
        const { safeAddress, ownerAddress, ownerName } = action.payload
        const { owners } = safes.get(safeAddress)
        const ownerToUpdateIndex = owners.findIndex(o => o.address.toLowerCase() === ownerAddress.toLowerCase())
        setOwners(safeAddress, owners.update(ownerToUpdateIndex, owner => owner.set('name', ownerName)))
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default safeStorageMware
