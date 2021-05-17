import { useSelector } from 'react-redux'

import { getNetworkId } from 'src/config'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

const chainId = getNetworkId()

type AddressInfo = { name: string | undefined; image: string | undefined }

type UseKnownAddressResponse = AddressInfo & { isAddressBook: boolean }

export const useKnownAddress = (address: string, addressInfo: AddressInfo): UseKnownAddressResponse => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, { address, chainId }))

  const isInAddressBook = recipientName !== 'UNKNOWN'

  return isInAddressBook
    ? {
        name: recipientName,
        image: undefined,
        isAddressBook: true,
      }
    : { ...addressInfo, isAddressBook: false }
}
