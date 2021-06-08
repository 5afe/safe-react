import { useSelector } from 'react-redux'

import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'

export const useSafeName = (safeAddress: string): string => {
  const addressBook = useSelector(addressBookSelector)

  return getNameFromAddressBook(addressBook, safeAddress) || ''
}
