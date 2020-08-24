import {
  isUserAnOwner,
  isUserAnOwnerOfAnySafe,
  isValidEnsName,
  sameAddress,
  shortVersionOf,
} from 'src/logic/wallets/ethAddresses'
import makeSafe from 'src/logic/safe/store/models/safe'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import { List } from 'immutable'

describe('sameAddress', () => {
  it('Given no first address, returns false', () => {
    // given
    const safeAddress = null
    const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'

    // when
    const result = sameAddress(safeAddress, safeAddress2)

    // then
    expect(result).toBe(false)
  })
  it('Given no second address, returns false', () => {
    // given
    const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
    const safeAddress2 = null

    // when
    const result = sameAddress(safeAddress, safeAddress2)

    // then
    expect(result).toBe(false)
  })
  it('Given two equal addresses, returns true', () => {
    // given
    const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'

    // when
    const result = sameAddress(safeAddress, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('Given two different addresses, returns false', () => {
    // given
    const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
    const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'

    // when
    const result = sameAddress(safeAddress, safeAddress2)

    // then
    expect(result).toBe(false)
  })
})

describe('shortVersionOf', () => {
  it('Given no address, returns Unknown ', () => {
    // given
    const safeAddress = null
    const cut = 5
    const resultExpected = 'Unknown'

    // when
    const result = shortVersionOf(safeAddress, cut)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given 0x344B941b1aAE2e4Be73987212FC4741687Bf0503 and a cut = 5, returns 0x344...f0503', () => {
    // given
    const safeAddress = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
    const cut = 5
    const resultExpected = `0x344...f0503`

    // when
    const result = shortVersionOf(safeAddress, cut)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a cut value bigger than the address length, returns the same address', () => {
    // given
    const safeAddress = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
    const cut = safeAddress.length
    const resultExpected = safeAddress

    // when
    const result = shortVersionOf(safeAddress, cut)

    // then
    expect(result).toBe(resultExpected)
  })
})

describe('isUserAnOwner', () => {
  it('Given no safe, returns false ', () => {
    // given
    const userAddress = 'address1'
    const safeInstance = null
    const resultExpected = false

    // when
    const result = isUserAnOwner(safeInstance, userAddress)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given no userAccount, returns false ', () => {
    // given
    const userAddress = null
    const owners = List([makeOwner({ address: userAddress })])
    const safeInstance = makeSafe({ owners })
    const resultExpected = false

    // when
    const result = isUserAnOwner(safeInstance, userAddress)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a safe without owners, returns false ', () => {
    // given
    const userAddress = 'address1'
    const owners = null
    const safeInstance = makeSafe({ owners })
    const resultExpected = false

    // when
    const result = isUserAnOwner(safeInstance, userAddress)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a safe with 1 owner, and an userAddress equals to that owner, returns true ', () => {
    // given
    const userAddress = 'address1'
    const owners = List([makeOwner({ address: userAddress })])
    const safeInstance = makeSafe({ owners })
    const resultExpected = true

    // when
    const result = isUserAnOwner(safeInstance, userAddress)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a safe with 1 owner, and an userAddress different to that owner, returns true ', () => {
    // given
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const owners = List([makeOwner({ address: userAddress })])
    const safeInstance = makeSafe({ owners })
    const resultExpected = false

    // when
    const result = isUserAnOwner(safeInstance, userAddress2)

    // then
    expect(result).toBe(resultExpected)
  })
})

describe('isUserAnOwnerOfAnySafe', () => {
  it('Given a list of safes, one of them has an owner equal to the userAddress, returns true', () => {
    // given
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const owners1 = List([makeOwner({ address: userAddress })])
    const owners2 = List([makeOwner({ address: userAddress2 })])
    const safeInstance = makeSafe({ owners: owners1 })
    const safeInstance2 = makeSafe({ owners: owners2 })
    const safesList = List([safeInstance, safeInstance2])
    const resultExpected = true

    // when
    const result = isUserAnOwnerOfAnySafe(safesList, userAddress)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a list of safes, none of them has an owner equal to the userAddress, returns false', () => {
    // given
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const userAddress3 = 'address3'
    const owners1 = List([makeOwner({ address: userAddress3 })])
    const owners2 = List([makeOwner({ address: userAddress2 })])
    const safeInstance = makeSafe({ owners: owners1 })
    const safeInstance2 = makeSafe({ owners: owners2 })
    const safesList = List([safeInstance, safeInstance2])
    const resultExpected = false

    // when
    const result = isUserAnOwnerOfAnySafe(safesList, userAddress)

    // then
    expect(result).toBe(resultExpected)
  })
})

describe('isValidEnsName', () => {
  it('Given no ens name, returns false', () => {
    // given
    const ensName = null
    const resultExpected = false

    // when
    const result = isValidEnsName(ensName)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a ens name not the format [value].[eth|test|xyz|luxe], returns false', () => {
    // given
    const ensName = 'test'
    const resultExpected = false

    // when
    const result = isValidEnsName(ensName)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a ens name not the format [value].[eth|test|xyz|luxe], returns false', () => {
    // given
    const ensName = 'test.et12312'
    const resultExpected = false

    // when
    const result = isValidEnsName(ensName)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a ens name in the format [value].eth, returns true', () => {
    // given
    const ensName = 'test.eth'
    const resultExpected = true

    // when
    const result = isValidEnsName(ensName)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a ens name in the format [value].test, returns true', () => {
    // given
    const ensName = 'test.test'
    const resultExpected = true

    // when
    const result = isValidEnsName(ensName)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a ens name in the format [value].xyz, returns true', () => {
    // given
    const ensName = 'test.xyz'
    const resultExpected = true

    // when
    const result = isValidEnsName(ensName)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a ens name in the format [value].luxe, returns true', () => {
    // given
    const ensName = 'test.luxe'
    const resultExpected = true

    // when
    const result = isValidEnsName(ensName)

    // then
    expect(result).toBe(resultExpected)
  })
})
