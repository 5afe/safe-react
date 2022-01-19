import * as configUtils from 'src/logic/config/utils'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { history } from 'src/routes/routes'
import { setChainIdFromUrl } from '../history'

describe('setChainIdFromUrl', () => {
  it('does not switch the network when there is no shortName in the url', () => {
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')
    const pathname = `/welcome`

    history.push(pathname)

    const result = setChainIdFromUrl(pathname)

    expect(result).toBe(false)
    expect(setChainIdMock).not.toHaveBeenCalled()
  })
  it('does not switch the network when the chainId has not changed', () => {
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')
    const pathname = `/rin:${ZERO_ADDRESS}`

    history.push(pathname)

    const result = setChainIdFromUrl(pathname)

    expect(result).toBe(true)
    expect(setChainIdMock).not.toHaveBeenCalled()
  })
  it('switches the network when the shortName changes', () => {
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')
    const pathname = `/eth:${ZERO_ADDRESS}`

    history.push(pathname)

    const result = setChainIdFromUrl(pathname)

    expect(result).toBe(true)
    expect(setChainIdMock).toHaveBeenCalled()
  })
  it('redirects to the Welcome page when incorrect shortName is in the URL', () => {
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')
    const pathname = `/fakechain:${ZERO_ADDRESS}`

    history.push(pathname)

    const result = setChainIdFromUrl(pathname)

    expect(result).toBe(false)
    expect(setChainIdMock).not.toHaveBeenCalled()
  })
})
