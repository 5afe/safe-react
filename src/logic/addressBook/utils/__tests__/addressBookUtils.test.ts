import { isValidAddressBookName } from 'src/logic/addressBook/utils'

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
