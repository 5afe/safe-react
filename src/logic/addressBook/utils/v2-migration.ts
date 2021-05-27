import { AddressBookEntry, AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { saveSafes, StoredSafes } from 'src/logic/safe/utils'
import { getNetworkName } from 'src/config'
import { Overwrite } from 'src/types/helpers'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { getEntryIndex, isValidAddressBookName } from '.'

interface StorageConfig {
  states: string[]
  namespace: string
  namespaceSeparator: string
}

/**
 * Migrates the safes names from the Safe Object to the Address Book
 *
 * Works on the persistence layer, reads from the localStorage and stores back the mutated safe info through immortalDB.
 *
 * @note If the Safe name is an invalid AB name, it's renamed to "Migrated from: {safe.name}"
 */
const migrateSafeNames = ({ states, namespace, namespaceSeparator }: StorageConfig): void => {
  const prefix = `v2_${getNetworkName()}`
  const storedSafes = localStorage.getItem(`_immortal|${prefix}__SAFES`)

  if (storedSafes === null) {
    // nothing left to migrate
    return
  }

  const parsedStoredSafes = JSON.parse(storedSafes) as Record<string, Overwrite<SafeRecordProps, { name: string }>>

  if (Object.entries(parsedStoredSafes).every(([, { name }]) => name === undefined)) {
    // no name key, safes already migrated
    return
  }

  const safesToAddressBook: AddressBookState = []
  const migratedSafes: StoredSafes =
    // once removed the name from the safe object, re-create the map
    Object.fromEntries(
      // prepare the safe's map to iterate over it
      Object.entries(parsedStoredSafes)
        // exclude those safes without name
        .filter(([, { name }]) => name !== undefined)
        // iterate over the list of safes
        .map(([safeAddress, { name, ...safe }]) => {
          let safeName = name

          if (!isValidAddressBookName(name)) {
            safeName = `Migrated from: ${name}`
          }

          // create an entry for the AB
          safesToAddressBook.push(makeAddressBookEntry({ address: safeAddress, name: safeName }))

          // return the new safe object without the name on it
          return [safeAddress, safe]
        }),
    )

  const [state] = states
  const addressBookKey = `${namespace}${namespaceSeparator}${state}`
  const storedAddressBook = localStorage.getItem(addressBookKey)
  let addressBookToStore: AddressBookState = []

  if (storedAddressBook !== null) {
    // stored AB information
    addressBookToStore = JSON.parse(storedAddressBook)
  }

  // mutate `addressBookToStore` by adding safes' information
  safesToAddressBook.forEach((entry) => {
    const safeIndex = getEntryIndex(addressBookToStore, entry)

    if (safeIndex >= 0) {
      // update AB entry with what was stored in the safe object
      addressBookToStore[safeIndex] = entry
    } else {
      // add the safe entry to the AB
      addressBookToStore.push(entry)
    }
  })

  try {
    // store the mutated address book
    localStorage.setItem(addressBookKey, JSON.stringify(addressBookToStore))
  } catch (error) {
    logError(Errors._200)
  }

  // update stored safe
  saveSafes(migratedSafes).then(() => console.info('updated Safe objects'))
}

/**
 * Migrates the AddressBook from a per-network to a global storage under the key `ADDRESS_BOOK` in `localStorage`
 *
 *  The migrated structure will be `{ address, name, chainId }`
 *
 * @note Also, adds `chainId` to every entry in the AddressBook list.
 */
const migrateAddressBook = ({ states, namespace, namespaceSeparator }: StorageConfig): void => {
  const [state] = states
  const prefix = `v2_${getNetworkName()}`
  const storageKey = `_immortal|${prefix}__ADDRESS_BOOK_STORAGE_KEY`
  let storedAddressBook: string | null = null

  try {
    storedAddressBook = localStorage.getItem(storageKey) as string | null
  } catch (e) {
    logError(Errors._200)
  }

  if (!storedAddressBook) {
    // nothing left to migrate
    return
  }

  let parsedAddressBook: Omit<AddressBookEntry, 'chainId'>[]
  try {
    parsedAddressBook = JSON.parse(JSON.parse(storedAddressBook))
  } catch (e) {
    logError(Errors._200)
    return
  }

  const migratedAddressBook = parsedAddressBook
    // exclude those addresses with invalid names and addresses
    .filter((item) => {
      return isValidAddressBookName(item.name) && getWeb3().utils.isAddress(item.address)
    })
    .map(({ address, ...entry }) =>
      makeAddressBookEntry({
        address,
        ...entry,
      }),
    )

  try {
    localStorage.setItem(`${namespace}${namespaceSeparator}${state}`, JSON.stringify(migratedAddressBook))
    localStorage.removeItem(storageKey)
  } catch (e) {
    logError(Errors._200)
    return
  }
}

const migrate = (storageConfig: StorageConfig): void => {
  migrateAddressBook(storageConfig)
  migrateSafeNames(storageConfig)
}

export default migrate
