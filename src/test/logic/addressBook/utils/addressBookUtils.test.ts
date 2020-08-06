import {Map, List} from 'immutable'
import { getAddressesListFromSafeAddressBook, getNameFromSafeAddressBook } from '../../../../logic/addressBook/utils'
import { AddressBookEntry, makeAddressBookEntry } from '../../../../logic/addressBook/model/addressBook'

const getMockAddressBookEntry = (address: string, name: string = 'test', isOwner: boolean = false): AddressBookEntry => makeAddressBookEntry({
  address,
  name,
  isOwner
})

describe('getAddressesListFromAdbk', () => {
  const safeAddress1 = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
  const entry1 = getMockAddressBookEntry('123456', 'test1')
  const entry2 = getMockAddressBookEntry('78910', 'test2')
  const entry3 = getMockAddressBookEntry('4781321', 'test3')
  const addressBook = Map({ safeAddress1: [entry1, entry2], safeAddress2: [entry3]})
  it('Given a safeAddressBook, returns the list of addresses within the addressBook',  () => {
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
  it('Given a safeAddressBook and an user account, returns the user name',  () => {
    // given
    const safeAddressBook = List([entry1, entry2, entry3])
    const expectedResult = entry2.name

    // when
    const result = getNameFromSafeAddressBook(safeAddressBook, entry2.address)

    // then
    expect(result).toBe(expectedResult)
  })
})