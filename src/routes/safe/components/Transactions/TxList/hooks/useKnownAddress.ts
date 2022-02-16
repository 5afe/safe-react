import { useSelector } from 'react-redux'

import { sameString } from 'src/utils/strings'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { AddressEx } from '@gnosis.pm/safe-react-gateway-sdk'

const DEFAULT_PROPS: AddressEx = {
  value: '',
  name: null,
  logoUri: null,
}

export type KnownAddressType = AddressEx & { isInAddressBook: boolean }
export const useKnownAddress = (props: AddressEx | null = DEFAULT_PROPS): KnownAddressType => {
  const recipientName = useSelector((state) => addressBookEntryName(state, { address: props?.value || '' }))

  // Undefined known address
  if (!props) {
    return {
      ...DEFAULT_PROPS,
      isInAddressBook: false,
    }
  }

  // We have to check that the name returned is not UNKNOWN
  const isInAddressBook = !sameString(recipientName, ADDRESS_BOOK_DEFAULT_NAME)
  const name = isInAddressBook && recipientName ? recipientName : props?.name

  return {
    ...props,
    name,
    isInAddressBook,
  }
}
