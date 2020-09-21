import { addAddressBookEntry } from 'src/logic/addressBook/store/actions/addAddressBookEntry'
import { saveDefaultSafe, saveSafes } from 'src/logic/safe/utils'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { saveActiveTokens } from 'src/logic/tokens/utils/tokensStorage'
import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from 'src/logic/safe/store/actions/activateTokenForAllSafes'
import { ADD_SAFE } from 'src/logic/safe/store/actions/addSafe'
import { ADD_SAFE_OWNER } from 'src/logic/safe/store/actions/addSafeOwner'
import { EDIT_SAFE_OWNER } from 'src/logic/safe/store/actions/editSafeOwner'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { REMOVE_SAFE_OWNER } from 'src/logic/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from 'src/logic/safe/store/actions/replaceSafeOwner'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { getActiveTokensAddressesForAllSafes, safesMapSelector } from 'src/logic/safe/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import { AddressBookEntry, AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addOrUpdateAddressBookEntry } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { getValidAddressBookName } from 'src/logic/addressBook/utils'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

const watchedActions = [
  ADD_SAFE,
  UPDATE_SAFE,
  REMOVE_SAFE,
  ADD_SAFE_OWNER,
  REMOVE_SAFE_OWNER,
  REPLACE_SAFE_OWNER,
  EDIT_SAFE_OWNER,
  ACTIVATE_TOKEN_FOR_ALL_SAFES,
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

/**
 * If the safe is not loaded, the owner wasn't not deleted
 * If the safe is already loaded and the owner has a valid name, will return true if the address is not already on the addressBook
 * @param name
 * @param address
 * @param addressBook
 * @param safeAlreadyLoaded
 */
// TODO TEST
const checkIfEntryWasDeletedFromAddressBook = (
  { name, address }: AddressBookEntry,
  addressBook: AddressBookState,
  safeAlreadyLoaded: boolean,
) => {
  if (!safeAlreadyLoaded) {
    return false
  }

  const addressShouldBeOnTheAddressBook = !!getValidAddressBookName(name)
  const isAlreadyInAddressBook = !!addressBook.find((entry) => sameAddress(entry.address, address))
  return addressShouldBeOnTheAddressBook && !isAlreadyInAddressBook
}

const safeStorageMware = (store) => (next) => async (action) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state = store.getState()
    const { dispatch } = store
    const safes = safesMapSelector(state)
    const addressBook = addressBookSelector(state)
    await saveSafes(safes.toJSON())

    switch (action.type) {
      case ACTIVATE_TOKEN_FOR_ALL_SAFES: {
        recalculateActiveTokens(state)
        break
      }
      case ADD_SAFE: {
        const { safe, loadedFromStorage } = action.payload
        const safeAlreadyLoaded =
          loadedFromStorage || safes.find((safeIterator) => sameAddress(safeIterator.address, safe.address))

        safe.owners.forEach((owner) => {
          const checksumEntry = makeAddressBookEntry({ address: checksumAddress(owner.address), name: owner.name })

          const ownerWasAlreadyInAddressBook = checkIfEntryWasDeletedFromAddressBook(
            checksumEntry,
            addressBook,
            safeAlreadyLoaded,
          )

          if (!ownerWasAlreadyInAddressBook) {
            dispatch(addAddressBookEntry(checksumEntry, { notifyEntryUpdate: false }))
          }
        })
        const safeWasAlreadyInAddressBook = checkIfEntryWasDeletedFromAddressBook(
          { address: safe.address, name: safe.name },
          addressBook,
          safeAlreadyLoaded,
        )

        if (!safeWasAlreadyInAddressBook) {
          dispatch(
            addAddressBookEntry(makeAddressBookEntry({ address: safe.address, name: safe.name }), {
              notifyEntryUpdate: true,
            }),
          )
        }
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
