import {
  checkIfEntryWasDeletedFromAddressBook,
  getNameFromAddressBook,
  isValidAddressBookName,
} from 'src/logic/addressBook/utils'
import { AddressBookEntry, AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'

const getMockAddressBookEntry = (address: string, name: string = 'test'): AddressBookEntry =>
  makeAddressBookEntry({
    address,
    name,
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

describe('isValidAddressBookName', () => {
  it('It should return false if given a blacklisted name like UNKNOWN', () => {
    // given
    const addressNameInput = 'UNKNOWN'

    const expectedResult = false

    // when
    const result = isValidAddressBookName(addressNameInput)

    // then
    expect(result).toStrictEqual(expectedResult)
  })
  it('It should return false if given a blacklisted name like MY WALLET', () => {
    // given
    const addressNameInput = 'MY WALLET'

    const expectedResult = false

    // when
    const result = isValidAddressBookName(addressNameInput)

    // then
    expect(result).toStrictEqual(expectedResult)
  })
  it('It should return false if given a blacklisted name like OWNER #', () => {
    // given
    const addressNameInput = 'OWNER #'

    const expectedResult = false

    // when
    const result = isValidAddressBookName(addressNameInput)

    // then
    expect(result).toStrictEqual(expectedResult)
  })
  it('It should return true if the given address name is valid', () => {
    // given
    const addressNameInput = 'User'

    const expectedResult = true

    // when
    const result = isValidAddressBookName(addressNameInput)

    // then
    expect(result).toEqual(expectedResult)
  })
})

describe('checkIfEntryWasDeletedFromAddressBook', () => {
  const mockAdd1 = '0x696fd93D725d84acfFf6c62a1fe8C94E1c9E934A'
  const mockAdd2 = '0x2C7aC78b01Be0FC66AD29b684ffAb0C93B381D00'
  const mockAdd3 = '0x537BD452c3505FC07bA242E437bD29D4E1DC9126'
  const entry1 = getMockAddressBookEntry(mockAdd1, 'test1')
  const entry2 = getMockAddressBookEntry(mockAdd2, 'test2')
  const entry3 = getMockAddressBookEntry(mockAdd3, 'test3')
  it('It should return true if a given entry was deleted from addressBook', () => {
    // given
    const addressBookEntry = entry1
    const addressBook: AddressBookState = [entry2, entry3]
    const safeAlreadyLoaded = true
    const expectedResult = true

    // when
    const result = checkIfEntryWasDeletedFromAddressBook(addressBookEntry, addressBook, safeAlreadyLoaded)

    // then
    expect(result).toEqual(expectedResult)
  })
  it('It should return false if a given entry was not deleted from addressBook', () => {
    // given
    const addressBookEntry = entry1
    const addressBook: AddressBookState = [entry1, entry2, entry3]
    const safeAlreadyLoaded = true
    const expectedResult = false

    // when
    const result = checkIfEntryWasDeletedFromAddressBook(addressBookEntry, addressBook, safeAlreadyLoaded)

    // then
    expect(result).toEqual(expectedResult)
  })
  it('It should return false if the safe was not already loaded', () => {
    // given
    const addressBookEntry = entry1
    const addressBook: AddressBookState = [entry1, entry2, entry3]
    const safeAlreadyLoaded = false
    const expectedResult = false

    // when
    const result = checkIfEntryWasDeletedFromAddressBook(addressBookEntry, addressBook, safeAlreadyLoaded)

    // then
    expect(result).toEqual(expectedResult)
  })
})
