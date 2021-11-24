import { AddressBookEntry, AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { saveSafes, StoredSafes } from 'src/logic/safe/utils'
import { removeFromStorage } from 'src/utils/storage'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { Errors, trackError } from 'src/logic/exceptions/CodedException'
import { getEntryIndex, isValidAddressBookName } from '.'
import { currentNetworkName } from 'src/logic/config/store/selectors'
import { store } from 'src/store'
import { RLSOptions, LoadOptions } from 'redux-localstorage-simple'
import { ADDRESS_BOOK_REDUCER_ID } from '../store/reducer'

type StorageConfig = Pick<RLSOptions | LoadOptions, 'namespace' | 'namespaceSeparator'>

/**
 * Migrates the safes names from the Safe Object to the Address Book
 *
 * Works on the persistence layer, reads from the localStorage and stores back the mutated safe info through immortalDB.
 *
 * @note If the Safe name is an invalid AB name, it's renamed to "Migrated from: {safe.name}"
 */
const migrateSafeNames = ({ namespace, namespaceSeparator }: StorageConfig): void => {
  const networkName = currentNetworkName(store.getState())
  const SAFES_KEY = `_immortal|v2_${networkName}__SAFES`

  const storedSafes = localStorage.getItem(SAFES_KEY)

  if (!storedSafes) {
    // nothing left to migrate
    return
  }

  const parsedStoredSafes = JSON.parse(storedSafes) as Record<string, any>

  if (Object.entries(parsedStoredSafes).every(([, { name }]) => name === undefined)) {
    // no name key, safes already migrated
    return
  }

  // make address book entries from the safe names & addresses
  const safeAbEntries: AddressBookState = Object.values(parsedStoredSafes)
    .filter(({ name }) => name && isValidAddressBookName(name))
    .map(({ address, name }) => makeAddressBookEntry({ address, name }))

  // remove names from the safes in place
  Object.values(parsedStoredSafes).forEach((item) => {
    item.owners = item.owners.map((owner: any) => owner.address)
    delete item.name
    item.loadedViaUrl = false
  })
  const migratedSafes = parsedStoredSafes as StoredSafes

  const addressBookKey = `${namespace}${namespaceSeparator}${ADDRESS_BOOK_REDUCER_ID}`
  const storedAddressBook = localStorage.getItem(addressBookKey)
  const addressBookToStore: AddressBookState = storedAddressBook ? JSON.parse(storedAddressBook) : []

  // mutate `addressBookToStore` by adding safes' information
  safeAbEntries.forEach((entry) => {
    const safeIndex = getEntryIndex(addressBookToStore, entry)

    if (safeIndex >= 0) {
      // update AB entry with what was stored in the safe object
      addressBookToStore[safeIndex] = entry
    } else {
      // add the safe entry to the AB
      addressBookToStore.push(entry)
    }
  })

  // store the mutated address book
  localStorage.setItem(addressBookKey, JSON.stringify(addressBookToStore))

  // update stored safe
  localStorage.setItem(SAFES_KEY, JSON.stringify(migratedSafes))
  saveSafes(migratedSafes).then(() => console.info('Safe objects migrated'))
}

/**
 * Migrates the AddressBook from a per-network to a global storage under the key `ADDRESS_BOOK` in `localStorage`
 *
 *  The migrated structure will be `{ address, name, chainId }`
 *
 * @note Also, adds `chainId` to every entry in the AddressBook list.
 */
const migrateAddressBook = ({ namespace, namespaceSeparator }: StorageConfig): void => {
  const networkName = currentNetworkName(store.getState())
  const prefix = `v2_${networkName}`
  const newKey = `${namespace}${namespaceSeparator}${ADDRESS_BOOK_REDUCER_ID}`
  const oldKey = 'ADDRESS_BOOK_STORAGE_KEY'
  const storageKey = `_immortal|${prefix}__${oldKey}`

  if (localStorage.getItem(newKey)) {
    // already migrated
    return
  }

  const storedAddressBook = localStorage.getItem(storageKey)

  if (!storedAddressBook) {
    // nothing to migrate
    return
  }

  const parsedAddressBook = JSON.parse(JSON.parse(storedAddressBook as string))

  const migratedAddressBook = (parsedAddressBook as Omit<AddressBookEntry, 'chainId'>[])
    // exclude those addresses with invalid names and addresses
    .filter((item) => {
      return item.name && isValidAddressBookName(item.name) && getWeb3().utils.isAddress(item.address)
    })
    .map(({ address, ...entry }) =>
      makeAddressBookEntry({
        address,
        ...entry,
      }),
    )

  localStorage.setItem(newKey, JSON.stringify(migratedAddressBook))

  // Remove the old Address Book storage
  localStorage.removeItem(storageKey)
  removeFromStorage(oldKey).then(() => console.info('Legacy Address Book removed'))
}

const migrate = (storageConfig: StorageConfig): void => {
  try {
    migrateAddressBook(storageConfig)
    migrateSafeNames(storageConfig)
  } catch (e) {
    trackError(Errors._200, e.message)
  }
}

export default migrate
