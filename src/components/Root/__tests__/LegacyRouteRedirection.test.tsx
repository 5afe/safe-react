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

  it('redirects to the unified host on staging', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        hash: '#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/address-book',
        host: 'safe-team-xdai.staging.gnosisdev.com',
        hostname: 'safe-team-xdai.staging.gnosisdev.com',
        href: 'https://safe-team-xdai.staging.gnosisdev.com/app/#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/address-book',
        origin: 'https://safe-team-xdai.staging.gnosisdev.com',
        pathname: '/app/',
        port: '',
        protocol: 'https:',
        replace: jest.fn(),
        search: '',
      },
    })

    render(<LegacyRouteRedirection history={history} />)

    expect(window.location.replace).toHaveBeenCalledWith(
      'https://safe-team.staging.gnosisdev.com/app/#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/address-book',
    )
  })

  it('redirects to the unified host on production', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        hash: '#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/balances',
        host: 'rinkeby.gnosis-safe.io',
        hostname: 'rinkeby.gnosis-safe.io',
        href: 'https://rinkeby.gnosis-safe.io/app/#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/balances',
        origin: 'https://rinkeby.gnosis-safe.io',
        pathname: '/app/',
        port: '',
        protocol: 'https:',
        replace: jest.fn(),
        search: '',
      },
    })

    render(<LegacyRouteRedirection history={history} />)

    expect(window.location.replace).toHaveBeenCalledWith(
      'https://.gnosis-safe.io/app/#/safes/0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/balances',
    )
  })
})
