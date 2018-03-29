// @flow
import { getAccountsFrom, getThresholdFrom } from './safe'

describe('Test JS', () => {
  it('return the addresses of owners', () => {
    const safe = {
      owner0Address: 'foo',
      owner1Address: 'bar',
      owner2Address: 'baz',
    }

    expect(['foo', 'bar', 'baz']).toEqual(getAccountsFrom(safe))
  })
  it('return the number of required confirmations', () => {
    const safe = {
      confirmations: '1',
    }

    expect(1).toEqual(getThresholdFrom(safe))
  })
})
