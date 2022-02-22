import { getTrackDataLayer } from '../googleTagManager'

describe('Track', () => {
  it('adds id, desc and stringified payload to dataLayer object', () => {
    const dataLayer = getTrackDataLayer({ id: 'test', desc: 'test' })

    expect(dataLayer).toEqual({
      'data-track-id': 'test',
      'data-track-desc': 'test',
      'data-track-chain': '{"chainId":"4","shortName":"rin"}',
    })
  })
  it('adds stringified payload if given', () => {
    const dataLayer = getTrackDataLayer({ id: 'test', desc: 'test', payload: { test: true } })

    expect(dataLayer).toEqual({
      'data-track-id': 'test',
      'data-track-desc': 'test',
      'data-track-chain': '{"chainId":"4","shortName":"rin"}',
      'data-track-payload': '{"test":true}',
    })
  })
})
