import { Map, List } from 'immutable'
import {
  getAddressBookFromStorage,
  getAddressesListFromSafeAddressBook,
  getNameFromSafeAddressBook,
  getOwnersWithNameFromAddressBook,
  saveAddressBook,
} from 'src/logic/addressBook/utils/index'
import { buildAddressBook } from 'src/logic/addressBook/store/reducer/addressBook'
import { AddressBookEntryRecord, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'

const getMockAddressBookEntry = (
  address: string,
  name: string = 'test',
  isOwner: boolean = false,
): AddressBookEntryRecord =>
  makeAddressBookEntry({
    address,
    name,
    isOwner,
  })

describe('getAddressesListFromAdbk', () => {
  const entry1 = getMockAddressBookEntry('123456', 'test1')
  const entry2 = getMockAddressBookEntry('78910', 'test2')
  const entry3 = getMockAddressBookEntry('4781321', 'test3')

  it('It should returns the list of addresses within the addressBook given a safeAddressBook', () => {
    // given
    const safeAddressBook = List([entry1, entry2, entry3])
    const expectedResult = [entry1.address, entry2.address, entry3.address]

    // when
    const result = getAddressesListFromSafeAddressBook(safeAddressBook)

    // then
    expect(result).toStrictEqual(expectedResult)
  })
})

describe('getNameFromSafeAddressBook', () => {
  const entry1 = getMockAddressBookEntry('123456', 'test1')
  const entry2 = getMockAddressBookEntry('78910', 'test2')
  const entry3 = getMockAddressBookEntry('4781321', 'test3')
  it('It should returns the user name given a safeAddressBook and an user account', () => {
    // given
    const safeAddressBook = List([entry1, entry2, entry3])
    const expectedResult = entry2.name

    // when
    const result = getNameFromSafeAddressBook(safeAddressBook, entry2.address)

    // then
    expect(result).toBe(expectedResult)
  })
})

describe('getOwnersWithNameFromAddressBook', () => {
  const entry1 = getMockAddressBookEntry('123456', 'test1')
  const entry2 = getMockAddressBookEntry('78910', 'test2')
  const entry3 = getMockAddressBookEntry('4781321', 'test3')
  it('It should returns the list of owners with their names given a safeAddressBook and a list of owners', () => {
    // given
    const safeAddressBook = List([entry1, entry2, entry3])
    const ownerList = List([
      { address: entry1.address, name: '' },
      { address: entry2.address, name: '' },
    ])
    const expectedResult = List([
      { address: entry1.address, name: entry1.name },
      { address: entry2.address, name: entry2.name },
    ])

    // when
    const result = getOwnersWithNameFromAddressBook(safeAddressBook, ownerList)

    // then
    expect(result).toStrictEqual(expectedResult)
  })
})

describe('saveAddressBook', () => {
  const safeAddress1 = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
  const entry1 = getMockAddressBookEntry('123456', 'test1')
  const entry2 = getMockAddressBookEntry('78910', 'test2')
  const entry3 = getMockAddressBookEntry('4781321', 'test3')
  it('It should save a given addressBook to the localStorage', async () => {
    // given
    const addressBook = Map({ [safeAddress1]: List([entry1, entry2]), [safeAddress2]: List([entry3]) })

    // when
    // @ts-ignore
    await saveAddressBook(addressBook)
    const storedAdBk = await getAddressBookFromStorage()
    let result = buildAddressBook(storedAdBk)

    // then
    expect(result).toStrictEqual(addressBook)
  })
})
