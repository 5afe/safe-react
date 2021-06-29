import { useSelector } from 'react-redux'

import { sameString } from 'src/utils/strings'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'

type AddressInfo = { name: string | undefined; image: string | undefined }

type UseKnownAddressResponse = AddressInfo & { isAddressBook: boolean }

export const useKnownAddress = (address: string, addressInfo: AddressInfo): UseKnownAddressResponse => {
  const recipientName = useSelector((state) => addressBookEntryName(state, { address }))
  // We have to check that the name returned is not UNKNOWN
  const isInAddressBook = !sameString(recipientName, ADDRESS_BOOK_DEFAULT_NAME)

  return isInAddressBook
    ? {
        name: recipientName,
        image: undefined,
        isAddressBook: true,
      }
    : { ...addressInfo, isAddressBook: false }
}
