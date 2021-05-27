import { Store } from 'redux'
import { saveDefaultSafe, saveSafes } from 'src/logic/safe/utils'
import { ADD_SAFE_OWNER } from 'src/logic/safe/store/actions/addSafeOwner'
import { EDIT_SAFE_OWNER } from 'src/logic/safe/store/actions/editSafeOwner'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { REMOVE_SAFE_OWNER } from 'src/logic/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from 'src/logic/safe/store/actions/replaceSafeOwner'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { safesMapSelector } from 'src/logic/safe/store/selectors'
import { ADD_OR_UPDATE_SAFE } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { checksumAddress } from 'src/utils/checksumAddress'
import { isValidAddressBookName } from 'src/logic/addressBook/utils'
import { addOrUpdateAddressBookEntry } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { SafeRecord } from '../models/safe'

const watchedActions = [
  UPDATE_SAFE,
  REMOVE_SAFE,
  ADD_OR_UPDATE_SAFE,
  ADD_SAFE_OWNER,
  REMOVE_SAFE_OWNER,
  REPLACE_SAFE_OWNER,
  EDIT_SAFE_OWNER,
  SET_DEFAULT_SAFE,
]

type SafeProps = {
  safe: SafeRecord
}

export const safeStorageMiddleware = (store: Store) => (
  next: (arg0: { type: string; payload: string | SafeProps | { address: string; name: string } }) => any,
) => async (action: {
  type: string
  payload: string | SafeProps | { name: string; address: string }
}): Promise<any> => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state = store.getState()
    const { dispatch } = store
    const safes = safesMapSelector(state)
    await saveSafes(safes.filter((safe) => !safe.loadedViaUrl).toJSON())

    switch (action.type) {
      case ADD_OR_UPDATE_SAFE: {
        const { safe } = action.payload as SafeProps
        safe.owners.forEach((owner: { address: string; name: any }) => {
          const checksumEntry = makeAddressBookEntry({ address: checksumAddress(owner.address), name: owner.name })
          if (isValidAddressBookName(checksumEntry.name)) {
            dispatch(addOrUpdateAddressBookEntry(checksumEntry))
          }
        })

        // add the recently loaded safe as an entry in the address book
        // if it exists already, it will be replaced with the recently added name
        if (safe.name) {
          dispatch(addOrUpdateAddressBookEntry(makeAddressBookEntry({ name: safe.name, address: safe.address })))
        }
        break
      }
      case UPDATE_SAFE: {
        const { name, address } = action.payload as { name: string; address: string }
        if (name) {
          dispatch(addOrUpdateAddressBookEntry(makeAddressBookEntry({ name, address })))
        }
        break
      }
      case SET_DEFAULT_SAFE: {
        if (action.payload) {
          saveDefaultSafe(action.payload as string)
        }
        break
      }
      default:
        break
    }
  }

  return handledAction
}
