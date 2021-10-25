import { useSelector } from 'react-redux'

import { sameString } from 'src/utils/strings'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { AddressEx } from '@gnosis.pm/safe-react-gateway-sdk'

type AddressExName = AddressEx['name']
type AddressExImage = AddressEx['logoUri']
type AddressInfo = { name: AddressExName | undefined; image: AddressExImage | undefined }

type UseKnownAddressResponse = { name: string | undefined; image: string | undefined; isAddressBook: boolean }

export const useKnownAddress = (address = ZERO_ADDRESS, { name, image }: AddressInfo): UseKnownAddressResponse => {
  const recipientName = useSelector((state) => addressBookEntryName(state, { address }))
  // We have to check that the name returned is not UNKNOWN
  const isInAddressBook = !sameString(recipientName, ADDRESS_BOOK_DEFAULT_NAME)

  return isInAddressBook
    ? {
        name: recipientName,
        image: undefined,
        isAddressBook: true,
      }
    : { name: name || undefined, image: image || undefined, isAddressBook: false }
}
