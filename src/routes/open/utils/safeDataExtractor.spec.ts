//
import { getAccountsFrom, getNamesFrom, getThresholdFrom } from './safeDataExtractor'

describe('Test JS', () => {
  it('return the addresses of owners', () => {
    const safe = {
      owner0Address: 'foo',
      owner1Address: 'bar',
      owner2Address: 'baz',
      owners: 3,
      confirmations: '0',
      name: '',
      safeCreationSalt: 0,
    }

    expect(getAccountsFrom(safe)).toEqual(['foo', 'bar', 'baz'])
  })
  it('return the names of owners', () => {
    const safe = {
      owner0Name: 'foo',
      owner0Address: '0x',
      owner1Name: 'bar',
      owner1Address: '0x',
      owner2Name: 'baz',
      owner2Address: '0x',
      owners: 3,
      confirmations: '0',
      name: '',
      safeCreationSalt: 0,
    }

    expect(getNamesFrom(safe)).toEqual(['foo', 'bar', 'baz'])
  })
  it('return first number of owners info based on owners property', () => {
    const safe = {
      owner0Name: 'fooName',
      owner0Address: 'fooAddress',
      owner1Name: 'barName',
      owner1Address: 'barAddress',
      owner2Name: 'bazName',
      owner2Address: 'bazAddress',
      owners: 1,
      confirmations: '0',
      name: '',
      safeCreationSalt: 0,
    }

    expect(getNamesFrom(safe)).toEqual(['fooName', 'barName', 'bazName'])
    expect(getAccountsFrom(safe)).toEqual(['fooAddress', 'barAddress', 'bazAddress'])
  })
  it('return name and address keys ordered alphabetically', () => {
    const safe = {
      owner1Name: 'barName',
      owner1Address: 'barAddress',
      owner0Name: 'fooName',
      owner2Name: 'bazName',
      owner2Address: 'bazAddress',
      owner0Address: 'fooAddress',
      owners: 1,
      confirmations: '0',
      name: '',
      safeCreationSalt: 0,
    }

    expect(getNamesFrom(safe)).toEqual(['fooName', 'barName', 'bazName'])
    expect(getAccountsFrom(safe)).toEqual(['fooAddress', 'barAddress', 'bazAddress'])
  })
  it('return the number of required confirmations', () => {
    const safe = {
      confirmations: '1',
      name: '',
      safeCreationSalt: 0,
    }

    expect(getThresholdFrom(safe)).toEqual(1)
  })
})
