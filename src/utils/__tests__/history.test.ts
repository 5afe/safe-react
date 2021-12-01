import * as configUtils from 'src/logic/config/utils'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { history } from 'src/routes/routes'
import { switchNetworkWithUrl } from '../history'

describe('switchNetworkWithUrl', () => {
  it('does not switch the network when there is no shortName in the url', () => {
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')

    history.push(`/rin:${ZERO_ADDRESS}`)

    switchNetworkWithUrl({ pathname: '/welcome' })

    expect(setChainIdMock).not.toHaveBeenCalled()
  })
  it('does not switch the network when the shortName has not changed', () => {
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')

    const pathname = `/rin:${ZERO_ADDRESS}`

    history.push(pathname)

    switchNetworkWithUrl({ pathname })

    expect(setChainIdMock).not.toHaveBeenCalled()
  })
  it('switches the network when the shortName changes', () => {
    const setChainIdMock = jest.spyOn(configUtils, 'setChainId')

    history.push(`/eth:${ZERO_ADDRESS}`)

    switchNetworkWithUrl({ pathname: `/eth:${ZERO_ADDRESS}` })

    expect(setChainIdMock).toHaveBeenCalled()
  })
})
