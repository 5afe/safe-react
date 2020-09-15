import { List } from 'immutable'
import {
  getAddressBookFromStorage,
  getAddressesListFromAdbk,
  getNameFromAdbk,
  getOwnersWithNameFromAddressBook,
  saveAddressBook,
} from 'src/logic/addressBook/utils/index'
import { buildAddressBook } from 'src/logic/addressBook/store/reducer/addressBook'
import { AddressBookEntry, AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'

const getMockAddressBookEntry = (address: string, name: string = 'test'): AddressBookEntry =>
  makeAddressBookEntry({
    address,
    name,
  })

describe('getAddressesListFromAdbk', () => {
  const entry1 = getMockAddressBookEntry('123456', 'test1')
  const entry2 = getMockAddressBookEntry('78910', 'test2')
  const entry3 = getMockAddressBookEntry('4781321', 'test3')

  it('It should returns the list of addresses within the addressBook given a safeAddressBook', () => {
    // given
    const safeAddressBook = [entry1, entry2, entry3]
    const expectedResult = [entry1.address, entry2.address, entry3.address]

    // when
    const result = getAddressesListFromAdbk(safeAddressBook)

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
    const safeAddressBook = [entry1, entry2, entry3]
    const expectedResult = entry2.name

    // when
    const result = getNameFromAdbk(safeAddressBook, entry2.address)

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
    const safeAddressBook = [entry1, entry2, entry3]
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
  const mockAdd1 = '0x696fd93D725d84acfFf6c62a1fe8C94E1c9E934A'
  const mockAdd2 = '0x2C7aC78b01Be0FC66AD29b684ffAb0C93B381D00'
  const mockAdd3 = '0x537BD452c3505FC07bA242E437bD29D4E1DC9126'
  const entry1 = getMockAddressBookEntry(mockAdd1, 'test1')
  const entry2 = getMockAddressBookEntry(mockAdd2, 'test2')
  const entry3 = getMockAddressBookEntry(mockAdd3, 'test3')
  it('It should save a given addressBook to the localStorage', async () => {
    // given
    const addressBook: AddressBookState = [entry1, entry2, entry3]

    // when
    // @ts-ignore
    await saveAddressBook(addressBook)
    const storedAdBk = await getAddressBookFromStorage()
    // @ts-ignore
    let result = buildAddressBook(storedAdBk)

    // then
    expect(result).toStrictEqual(addressBook)
  })
})
