import { List } from 'immutable'
import {
  getAddressBookFromStorage,
  getAddressesListFromAddressBook,
  getNameFromAddressBook,
  getOwnersWithNameFromAddressBook,
  migrateOldAddressBook,
  OldAddressbookEntry,
  OldAddressbookType,
  saveAddressBook,
} from 'src/logic/addressBook/utils/index'
import { buildAddressBook } from 'src/logic/addressBook/store/reducer/addressBook'
import { AddressBookEntry, AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'

const getMockAddressBookEntry = (address: string, name: string = 'test'): AddressBookEntry =>
  makeAddressBookEntry({
    address,
    name,
  })

const getMockOldAddressBookEntry = ({ address = '', name = '', isOwner = false }): OldAddressbookEntry => {
  return {
    address,
    name,
    isOwner,
  }
}

describe('getAddressesListFromAdbk', () => {
  const entry1 = getMockAddressBookEntry('123456', 'test1')
  const entry2 = getMockAddressBookEntry('78910', 'test2')
  const entry3 = getMockAddressBookEntry('4781321', 'test3')

  it('It should returns the list of addresses within the addressBook given a safeAddressBook', () => {
    // given
    const safeAddressBook = [entry1, entry2, entry3]
    const expectedResult = [entry1.address, entry2.address, entry3.address]

    // when
    const result = getAddressesListFromAddressBook(safeAddressBook)

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
    const result = getNameFromAddressBook(safeAddressBook, entry2.address)

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

describe('migrateOldAddressBook', () => {
  const safeAddress1 = '0x696fd93D725d84acfFf6c62a1fe8C94E1c9E934A'
  const safeAddress2 = '0x2C7aC78b01Be0FC66AD29b684ffAb0C93B381D00'
  const mockAdd1 = '0x9163c2F4452E3399CB60AAf737231Af87548DA91'
  const mockAdd2 = '0xC4e446Da9C3D37385C86488294C6758c4e25dbD8'

  it('It should receive an addressBook in old format and return the same addressBook in new format', () => {
    // given
    const entry1 = getMockOldAddressBookEntry({ name: 'test1', address: mockAdd1 })
    const entry2 = getMockOldAddressBookEntry({ name: 'test2', address: mockAdd2 })

    const oldAddressBook: OldAddressbookType = {
      [safeAddress1]: [entry1],
      [safeAddress2]: [entry2],
    }

    const expectedEntry1 = getMockAddressBookEntry(mockAdd1, 'test1')
    const expectedEntry2 = getMockAddressBookEntry(mockAdd2, 'test2')
    const expectedResult = [expectedEntry1, expectedEntry2]

    // when
    const result = migrateOldAddressBook(oldAddressBook)

    // then
    expect(result).toStrictEqual(expectedResult)
  })
})

jest.mock('src/utils/storage/index')
describe('getAddressBookFromStorage', () => {
  const safeAddress1 = '0x696fd93D725d84acfFf6c62a1fe8C94E1c9E934A'
  const safeAddress2 = '0x2C7aC78b01Be0FC66AD29b684ffAb0C93B381D00'
  const mockAdd1 = '0x9163c2F4452E3399CB60AAf737231Af87548DA91'
  const mockAdd2 = '0xC4e446Da9C3D37385C86488294C6758c4e25dbD8'
  afterAll(() => {
    jest.unmock('src/utils/storage/index')
  })
  it('It should return null if no addressBook in storage', async () => {
    // given

    const expectedResult = null
    const storageUtils = require('src/utils/storage/index')
    const spy = storageUtils.loadFromStorage.mockImplementationOnce(() => null)

    // when
    const result = await getAddressBookFromStorage()

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(spy).toHaveBeenCalled()
  })
  it('It should return migrated addressBook if old addressBook in storage', async () => {
    // given
    const expectedEntry1 = getMockAddressBookEntry(mockAdd1, 'test1')
    const expectedEntry2 = getMockAddressBookEntry(mockAdd2, 'test2')
    const entry1 = getMockOldAddressBookEntry({ name: 'test1', address: mockAdd1 })
    const entry2 = getMockOldAddressBookEntry({ name: 'test2', address: mockAdd2 })
    const oldAddressBook: OldAddressbookType = {
      [safeAddress1]: [entry1],
      [safeAddress2]: [entry2],
    }
    const expectedResult = [expectedEntry1, expectedEntry2]

    const storageUtils = require('src/utils/storage/index')
    const spy = storageUtils.loadFromStorage.mockImplementationOnce(() => oldAddressBook)

    // when
    const result = await getAddressBookFromStorage()

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(spy).toHaveBeenCalled()
  })
  it('It should return addressBook if addressBook in storage', async () => {
    // given
    const expectedEntry1 = getMockAddressBookEntry(mockAdd1, 'test1')
    const expectedEntry2 = getMockAddressBookEntry(mockAdd2, 'test2')

    const expectedResult = [expectedEntry1, expectedEntry2]

    const storageUtils = require('src/utils/storage/index')
    const spy = storageUtils.loadFromStorage.mockImplementationOnce(() => JSON.stringify(expectedResult))

    // when
    const result = await getAddressBookFromStorage()

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(spy).toHaveBeenCalled()
  })
})
