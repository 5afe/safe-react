import { isUserAnOwner, sameAddress, shortVersionOf } from 'src/logic/wallets/ethAddresses'
import makeSafe from 'src/routes/safe/store/models/safe'
import { makeOwner } from 'src/routes/safe/store/models/owner'
import { List } from 'immutable'

describe('sameAddress', () => {
  it('Given no first address, returns false',  () => {
    // given
    const safeAddress = null
    const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'

    // when
    const result = sameAddress(safeAddress, safeAddress2)

    // then
    expect(result).toBe(false)
  })
  it('Given no second address, returns false',  () => {
    // given
    const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
    const safeAddress2 = null

    // when
    const result = sameAddress(safeAddress, safeAddress2)

    // then
    expect(result).toBe(false)
  })
  it('Given two equal addresses, returns true',  () => {
    // given
    const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'

    // when
    const result = sameAddress(safeAddress, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('Given two different addresses, returns false',  () => {
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
  it('Given no address, returns Unknown ',  () => {
    // given
    const safeAddress = null
    const cut = 5
    const resultExpected = 'Unknown'

    // when
    const result = shortVersionOf(safeAddress, cut)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given 0x344B941b1aAE2e4Be73987212FC4741687Bf0503 and a cut = 5, returns 0x344...f0503',  () => {
    // given
    const safeAddress = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
    const cut = 5
    const resultExpected = `0x344...f0503`

    // when
    const result = shortVersionOf(safeAddress, cut)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a cut value bigger than the address length, returns the same address',  () => {
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
  it('Given no safe, returns false ',  () => {
    // given
    const userAddress = 'address1'
    const safeInstance = null
    const resultExpected = false

    // when
    const result = isUserAnOwner(safeInstance, userAddress)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given no userAccount, returns false ',  () => {
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
  it('Given a safe without owners, returns false ',  () => {
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
  it('Given a safe with 1 owner, and an userAddress equals to that owner, returns true ',  () => {
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
  it('Given a safe with 1 owner, and an userAddress different to that owner, returns true ',  () => {
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
