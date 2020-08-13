//
import { getAccountsFrom, getNamesFrom, getThresholdFrom } from './safeDataExtractor'

describe('Test JS', () => {
  it('return the addresses of owners', () => {
    const safe = {
      owner0Address: 'foo',
      owner1Address: 'bar',
      owner2Address: 'baz',
      owners: 3,
    }

    expect(getAccountsFrom(safe)).toEqual(['foo', 'bar', 'baz'])
  })
  it('return the names of owners', () => {
    const safe = {
      owner0Name: 'foo',
      owner1Name: 'bar',
      owner2Name: 'baz',
      owners: 3,
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
    }

    expect(getNamesFrom(safe)).toEqual(['fooName'])
    expect(getAccountsFrom(safe)).toEqual(['fooAddress'])
  })
  it('return name and address ordered alphabetically', () => {
    const safe = {
      owner1Name: 'barName',
      owner1Address: 'barAddress',
      owner0Name: 'fooName',
      owner2Name: 'bazName',
      owner2Address: 'bazAddress',
      owner0Address: 'fooAddress',
      owners: 1,
    }

    expect(getNamesFrom(safe)).toEqual(['fooName'])
    expect(getAccountsFrom(safe)).toEqual(['fooAddress'])
  })
  it('return the number of required confirmations', () => {
    const safe = {
      confirmations: '1',
    }

    expect(getThresholdFrom(safe)).toEqual(1)
  })
})
