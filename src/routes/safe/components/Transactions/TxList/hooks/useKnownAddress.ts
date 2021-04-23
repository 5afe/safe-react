import { useSelector } from 'react-redux'

import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

type AddressInfo = { name: string | undefined; image: string | undefined }

export const useKnownAddress = (address: string, addressInfo: AddressInfo): AddressInfo => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, address))

  const isInAddressBook = recipientName !== 'UNKNOWN'

  return isInAddressBook
    ? {
        name: recipientName,
        image: undefined,
      }
    : addressInfo
}
