import { useSelector } from 'react-redux'

import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

type AddressInfo = { name: string | undefined; image: string | undefined }

type UseKnownAddressResponse = AddressInfo & { isAddressBook: boolean }

export const useKnownAddress = (address: string, addressInfo: AddressInfo): UseKnownAddressResponse => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, { address }))

  const isInAddressBook = recipientName !== ADDRESS_BOOK_DEFAULT_NAME

  return isInAddressBook
    ? {
        name: recipientName,
        image: undefined,
        isAddressBook: true,
      }
    : { ...addressInfo, isAddressBook: false }
}
