import { getInteractionTitle } from '../helpers/utils'

describe('getInteractionTitle', () => {
  it('should return no amount relevant title for a numeric 0 amount', () => {
    expect(getInteractionTitle(0)).toEqual('Interact with:')
  })
  it('should return no amount relevant title for a string 0 amount', () => {
    expect(getInteractionTitle('0')).toEqual('Interact with:')
  })
  it('should return an amount relevant title for a numeric amount', () => {
    expect(getInteractionTitle(1)).toEqual(`Interact with (and send 1 ETH to):`)
    expect(getInteractionTitle(0.1)).toEqual(`Interact with (and send 0.1 ETH to):`)
  })
  it('should return an amount relevant title for a string amount', () => {
    expect(getInteractionTitle('1')).toEqual(`Interact with (and send 1 ETH to):`)
    expect(getInteractionTitle('0.1')).toEqual(`Interact with (and send 0.1 ETH to):`)
  })
})
