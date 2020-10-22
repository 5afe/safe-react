//@ts-nocheck
import { List } from 'immutable'

import {
  isUserAnOwner,
  isUserAnOwnerOfAnySafe,
  isValidEnsName,
  sameAddress,
  shortVersionOf,
} from 'src/logic/wallets/ethAddresses'
import makeSafe from 'src/logic/safe/store/models/safe'
import { makeOwner } from 'src/logic/safe/store/models/owner'

describe('src/logic/wallets/ethAddresses', () => {
  describe('Utility function: sameAddress', () => {
    it('It should return false if no address given', () => {
      // given
      const safeAddress = null
      const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'

      // when
      const result = sameAddress(safeAddress, safeAddress2)

      // then
      expect(result).toBe(false)
    })
    it('It should return false if not second address given', () => {
      // given
      const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
      const safeAddress2 = null

      // when
      const result = sameAddress(safeAddress, safeAddress2)

      // then
      expect(result).toBe(false)
    })
    it('It should return true if two equal addresses given', () => {
      // given
      const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'

      // when
      const result = sameAddress(safeAddress, safeAddress.toLowerCase())

      // then
      expect(result).toBe(true)
    })
    it('If should return false if two different addresses given', () => {
      // given
      const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
      const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'

      // when
      const result = sameAddress(safeAddress, safeAddress2)

      // then
      expect(result).toBe(false)
    })
  })

  describe('Utility function: shortVersionOf', () => {
    it('It should return Unknown if no address given', () => {
      // given
      const safeAddress = null
      const cut = 5
      const expectedResult = 'Unknown'

      // when
      const result = shortVersionOf(safeAddress, cut)

      // then
      expect(result).toBe(expectedResult)
    })
    it('It should return 0x344...f0503 if given 0x344B941b1aAE2e4Be73987212FC4741687Bf0503 and a cut = 5', () => {
      // given
      const safeAddress = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
      const cut = 5
      const expectedResult = `0x344...f0503`

      // when
      const result = shortVersionOf(safeAddress, cut)

      // then
      expect(result).toBe(expectedResult)
    })
    it('If should return the same address if a cut value bigger than the address length given', () => {
      // given
      const safeAddress = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
      const cut = safeAddress.length
      const expectedResult = safeAddress

      // when
      const result = shortVersionOf(safeAddress, cut)

      // then
      expect(result).toBe(expectedResult)
    })
  })

  describe('Utility function: isUserAnOwner', () => {
    it("Should return false if there's no Safe", () => {
      // given
      const userAddress = 'address1'
      const safeInstance = null
      const expectedResult = false

      // when
      const result = isUserAnOwner(safeInstance, userAddress)

      // then
      expect(result).toBe(expectedResult)
    })
    it("Should return false if there's no `userAccount`", () => {
      // given
      const userAddress = null
      const owners = List([makeOwner({ address: userAddress })])
      const safeInstance = makeSafe({ owners })
      const expectedResult = false

      // when
      const result = isUserAnOwner(safeInstance, userAddress)

      // then
      expect(result).toBe(expectedResult)
    })
    it('Should return false if there are no owners for the Safe', () => {
      // given
      const userAddress = 'address1'
      const owners = null
      const safeInstance = makeSafe({ owners })
      const expectedResult = false

      // when
      const result = isUserAnOwner(safeInstance, userAddress)

      // then
      expect(result).toBe(expectedResult)
    })
    it("Should return true if `userAccount` is not in the list of Safe's owners", () => {
      // given
      const userAddress = 'address1'
      const owners = List([makeOwner({ address: userAddress })])
      const safeInstance = makeSafe({ owners })
      const expectedResult = true

      // when
      const result = isUserAnOwner(safeInstance, userAddress)

      // then
      expect(result).toBe(expectedResult)
    })
    it("Should return false if `userAccount` is not in the list of Safe's owners", () => {
      // given
      const userAddress = 'address1'
      const userAddress2 = 'address2'
      const owners = List([makeOwner({ address: userAddress })])
      const safeInstance = makeSafe({ owners })
      const expectedResult = false

      // when
      const result = isUserAnOwner(safeInstance, userAddress2)

      // then
      expect(result).toBe(expectedResult)
    })
  })

  describe('Utility function: isUserAnOwnerOfAnySafe', () => {
    it('Should return true if given a list of safes, one of them has an owner equal to the userAccount', () => {
      // given
      const userAddress = 'address1'
      const userAddress2 = 'address2'
      const owners1 = List([makeOwner({ address: userAddress })])
      const owners2 = List([makeOwner({ address: userAddress2 })])
      const safeInstance = makeSafe({ owners: owners1 })
      const safeInstance2 = makeSafe({ owners: owners2 })
      const safesList = List([safeInstance, safeInstance2])
      const expectedResult = true

      // when
      const result = isUserAnOwnerOfAnySafe(safesList, userAddress)

      // then
      expect(result).toBe(expectedResult)
    })
    it('It should return false if given a list of safes, none of them has an owner equal to the userAccount', () => {
      // given
      const userAddress = 'address1'
      const userAddress2 = 'address2'
      const userAddress3 = 'address3'
      const owners1 = List([makeOwner({ address: userAddress3 })])
      const owners2 = List([makeOwner({ address: userAddress2 })])
      const safeInstance = makeSafe({ owners: owners1 })
      const safeInstance2 = makeSafe({ owners: owners2 })
      const safesList = List([safeInstance, safeInstance2])
      const expectedResult = false

      // when
      const result = isUserAnOwnerOfAnySafe(safesList, userAddress)

      // then
      expect(result).toBe(expectedResult)
    })
  })

  describe('Utility function: isValidEnsName', () => {
    it('If should return false if given no ens name', () => {
      // given
      const ensName = null
      const expectedResult = false

      // when
      const result = isValidEnsName(ensName)

      // then
      expect(result).toBe(expectedResult)
    })
    it('It should return false for an ens without extension in format [value].[eth|test|xyz|luxe]', () => {
      // given
      const ensName = 'test'
      const expectedResult = false

      // when
      const result = isValidEnsName(ensName)

      // then
      expect(result).toBe(expectedResult)
    })
    it('It should return false for an ens without the format [value].[eth|test|xyz|luxe]', () => {
      // given
      const ensName = 'test.et12312'
      const expectedResult = false

      // when
      const result = isValidEnsName(ensName)

      // then
      expect(result).toBe(expectedResult)
    })
    it('It should return true for an ens in format [value].eth', () => {
      // given
      const ensName = 'test.eth'
      const expectedResult = true

      // when
      const result = isValidEnsName(ensName)

      // then
      expect(result).toBe(expectedResult)
    })
    it('It should return true for ens in format [value].test', () => {
      // given
      const ensName = 'test.test'
      const expectedResult = true

      // when
      const result = isValidEnsName(ensName)

      // then
      expect(result).toBe(expectedResult)
    })
    it('It should return true for an ens in the format [value].xyz', () => {
      // given
      const ensName = 'test.xyz'
      const expectedResult = true

      // when
      const result = isValidEnsName(ensName)

      // then
      expect(result).toBe(expectedResult)
    })
    it('It should return true for an ens in format [value].luxe', () => {
      // given
      const ensName = 'test.luxe'
      const expectedResult = true

      // when
      const result = isValidEnsName(ensName)

      // then
      expect(result).toBe(expectedResult)
    })
  })
})
