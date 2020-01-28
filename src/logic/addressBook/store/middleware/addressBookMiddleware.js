// @flow
import type { AnyAction, Store } from 'redux'
import { type GlobalState } from '~/safeStore'
import { ADD_ENTRY } from '~/logic/addressBook/store/actions/addAddressBookEntry'
import { REMOVE_ENTRY } from '~/logic/addressBook/store/actions/removeAddressBookEntry'
import { UPDATE_ENTRY } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { addressBookMapSelector } from '~/logic/addressBook/store/selectors'
import { enhanceSnackbarForAction, getNotificationsFromTxType } from '~/logic/notifications'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'
import { saveAddressBook } from '~/logic/addressBook/utils'
import type { AddressBookProps } from '~/logic/addressBook/model/addressBook'
import { get3Box } from '~/utils/storage'

const watchedActions = [
  ADD_ENTRY,
  REMOVE_ENTRY,
  UPDATE_ENTRY,
]


const addressBookMiddleware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()
    const { dispatch } = store
    const addressBook: AddressBookProps = addressBookMapSelector(state)
    if (addressBook) {
      try {
        await get3Box()
        await saveAddressBook(addressBook, true)
      } catch (e) {
        await saveAddressBook(addressBook)
      }
    }

    switch (action.type) {
      case ADD_ENTRY: {
        const { isOwner } = action.payload.entry
        if (!isOwner) {
          const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_NEW_ENTRY)
          dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        }
        break
      }
      case REMOVE_ENTRY: {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_DELETE_ENTRY)
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        break
      }
      case UPDATE_ENTRY: {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_EDIT_ENTRY)
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default addressBookMiddleware
