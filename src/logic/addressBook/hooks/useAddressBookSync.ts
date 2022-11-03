import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { addressBookFixEmptyNames, addressBookSync } from 'src/logic/addressBook/store/actions'
import { ADDRESS_BOOK_REDUCER_ID } from 'src/logic/addressBook/store/reducer'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'

const useAddressBookSync = (): void => {
  const dispatch = useDispatch<Dispatch>()

  useEffect(() => {
    const onStorageUpdate = (e: StorageEvent) => {
      if (e.newValue && e.newValue !== e.oldValue && e.key?.endsWith(ADDRESS_BOOK_REDUCER_ID)) {
        let newState: AddressBookState
        try {
          newState = JSON.parse(e.newValue) as AddressBookState
        } catch (e) {
          return
        }
        dispatch(addressBookSync(newState))
      }
    }

    window.addEventListener('storage', onStorageUpdate)

    return () => {
      window.removeEventListener('storage', onStorageUpdate)
    }
  }, [dispatch])

  // Temporary fix that should be removed after a sufficient amount of time
  useEffect(() => {
    dispatch(addressBookFixEmptyNames())
  }, [dispatch])
}

export default useAddressBookSync
