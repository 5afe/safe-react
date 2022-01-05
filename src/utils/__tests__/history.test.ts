import { getShortName } from 'src/config'
import * as configUtils from 'src/logic/config/utils'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { history, WELCOME_ROUTE } from 'src/routes/routes'
import { switchNetworkWithUrl } from '../history'

describe('switchNetworkWithUrl', () => {
  it('does not switch the network when there is no shortName in the url', () => {
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')

    history.push(`/rin:${ZERO_ADDRESS}`)

    switchNetworkWithUrl({ pathname: '/welcome' })

    expect(setChainIdMock).not.toHaveBeenCalled()
  })
  it('does not switch the network when the shortName has not changed', () => {
    // chainId defaults to RINKEBY in non-production environments if it can't be read from LS
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')

    history.push(`/rin:${ZERO_ADDRESS}`)

    switchNetworkWithUrl(history.location)

    expect(setChainIdMock).not.toHaveBeenCalled()
  })
  it('switches the network when the shortName changes', () => {
    // chainId defaults to RINKEBY in non-production environments if it can't be read from LS
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')

    history.push(`/eth:${ZERO_ADDRESS}`)

    switchNetworkWithUrl(history.location)

    expect(setChainIdMock).toHaveBeenCalled()
  })
  it('redirects to the Welcome page when incorrect shortName is in the URL', () => {
    history.push(`/fakechain:${ZERO_ADDRESS}`)

    switchNetworkWithUrl(history.location)

    expect(history.location.pathname).toBe(WELCOME_ROUTE)
  })
})
