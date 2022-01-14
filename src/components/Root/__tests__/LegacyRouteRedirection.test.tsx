import { render } from '@testing-library/react'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { history } from 'src/routes/routes'
import LegacyRouteRedirection from '../LegacyRouteRedirection'

describe('LegacyRouteRedirection', () => {
  it('redirects legacy safe links and prepends the short chain name', () => {
    history.push(`/#/safes/${ZERO_ADDRESS}`)

    render(<LegacyRouteRedirection history={history} />)

    expect(window.location.pathname).toBe(`/rin:${ZERO_ADDRESS}`)
  })
  it('redirects (addressed) legacy load links and prepends the short chain name', () => {
    history.push(`/#/load/${ZERO_ADDRESS}`)

    render(<LegacyRouteRedirection history={history} />)

    expect(window.location.pathname).toBe(`/load/rin:${ZERO_ADDRESS}`)
  })
  it('redirects (non-addressed) legacy links without alteration', () => {
    //TODO:
    history.push(`/#/welcome`)

    render(<LegacyRouteRedirection history={history} />)

    expect(window.location.pathname).toBe(`/welcome`)
  })
  it('does not redirect new links', () => {
    history.push(`/rin:${ZERO_ADDRESS}`)

    render(<LegacyRouteRedirection history={history} />)

    // Window location should not have been touched, but test in case
    expect(window.location.pathname).toBe(`/rin:${ZERO_ADDRESS}`)
    expect(history.location.pathname).toBe(`/rin:${ZERO_ADDRESS}`)
  })
})
