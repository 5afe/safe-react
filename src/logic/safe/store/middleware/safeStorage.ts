import { saveDefaultSafe, saveSafes } from 'src/logic/safe/utils'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { saveActiveTokens } from 'src/logic/tokens/utils/tokensStorage'
import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from 'src/logic/safe/store/actions/activateTokenForAllSafes'
import { ADD_SAFE_OWNER } from 'src/logic/safe/store/actions/addSafeOwner'
import { EDIT_SAFE_OWNER } from 'src/logic/safe/store/actions/editSafeOwner'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { REMOVE_SAFE_OWNER } from 'src/logic/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from 'src/logic/safe/store/actions/replaceSafeOwner'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { UPDATE_TOKENS_LIST } from 'src/logic/safe/store/actions/updateTokensList'
import { UPDATE_ASSETS_LIST } from 'src/logic/safe/store/actions/updateAssetsList'
import { getActiveTokensAddressesForAllSafes, safesMapSelector } from 'src/logic/safe/store/selectors'
import { ADD_OR_UPDATE_SAFE } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { checksumAddress } from 'src/utils/checksumAddress'
import { isValidAddressBookName } from 'src/logic/addressBook/utils'
import { addOrUpdateAddressBookEntry } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'

const watchedActions = [
  UPDATE_SAFE,
  REMOVE_SAFE,
  ADD_OR_UPDATE_SAFE,
  ADD_SAFE_OWNER,
  REMOVE_SAFE_OWNER,
  REPLACE_SAFE_OWNER,
  EDIT_SAFE_OWNER,
  ACTIVATE_TOKEN_FOR_ALL_SAFES,
  UPDATE_TOKENS_LIST,
  UPDATE_ASSETS_LIST,
  SET_DEFAULT_SAFE,
]

const recalculateActiveTokens = (state) => {
  const tokens = tokensSelector(state)
  const activeTokenAddresses = getActiveTokensAddressesForAllSafes(state)

  const activeTokens = tokens.withMutations((map) => {
    map.forEach((token) => {
      if (!activeTokenAddresses.has(token.address)) {
        map.remove(token.address)
      }
    })
  })

  saveActiveTokens(activeTokens)
}

const safeStorageMware = (store) => (next) => async (action) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state = store.getState()
    const { dispatch } = store
    const safes = safesMapSelector(state)
    await saveSafes(safes.toJSON())

    switch (action.type) {
      case ACTIVATE_TOKEN_FOR_ALL_SAFES: {
        recalculateActiveTokens(state)
        break
      }
      case ADD_OR_UPDATE_SAFE: {
        const { safe } = action.payload
        safe.owners.forEach((owner) => {
          const checksumEntry = makeAddressBookEntry({ address: checksumAddress(owner.address), name: owner.name })
          if (isValidAddressBookName(checksumEntry.name)) {
            dispatch(addOrUpdateAddressBookEntry(checksumEntry))
          }
        })
        break
      }
      case UPDATE_SAFE: {
        const { activeTokens, name, address } = action.payload
        if (activeTokens) {
          recalculateActiveTokens(state)
        }
        if (name) {
          dispatch(addOrUpdateAddressBookEntry(makeAddressBookEntry({ name, address })))
        }
        break
      }
      case SET_DEFAULT_SAFE: {
        if (action.payload) {
          saveDefaultSafe(action.payload)
        }
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default safeStorageMware
