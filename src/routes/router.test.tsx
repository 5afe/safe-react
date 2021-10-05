import { PUBLIC_URL } from 'src/utils/constants'
import {
  generateSafeRoute,
  getAllSafeRoutesWithPrefixedAddress,
  getPrefixedSafeAddressSlug,
  hasPrefixedSafeAddressInUrl,
  SAFE_ROUTES,
  WELCOME_ROUTE,
  getPrefixedSafeAddressFromUrl,
  ADDRESSED_ROUTE,
  history,
} from './routes'
import { Route, Switch } from 'react-router'
import { render } from 'src/utils/test-utils'

const validSafeAddress = '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f'
const push = (pathname: string) =>
  window.history.pushState(null, '', `${window.location.origin}/${PUBLIC_URL}${pathname}`)

describe('chainSpecificSafeAddressPathRegExp', () => {
  it('renders routes with chain-specific addresses', () => {
    const testId = 'addressed-route'
    const { getByTestId } = render(<Route path={ADDRESSED_ROUTE} render={() => <div data-testid={testId} />} />)

    const route = generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, { shortName: 'rin', safeAddress: validSafeAddress })
    history.push(route)

    expect(getByTestId(testId)).toBeInTheDocument()
  })
  it('does not render routes without chain-specific addresses', () => {
    const addressedTestId = 'addressed-route'
    const welcomeTestId = 'welcome-route'

    const { getByTestId } = render(
      <Switch>
        <Route path={ADDRESSED_ROUTE} render={() => <div data-testid={addressedTestId} />} />
        <Route path={WELCOME_ROUTE} render={() => <div data-testid={welcomeTestId} />} />
      </Switch>,
    )

    history.push(WELCOME_ROUTE)

    expect(getByTestId(addressedTestId)).toBeNull()
    expect(getByTestId(welcomeTestId)).toBeInTheDocument()
  })
})

describe('getPrefixedSafeAddressFromUrl', () => {
  it('returns the chain-specific addresses from the url if both supplied', () => {
    const shortName = 'rin'
    const route = generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, { shortName, safeAddress: validSafeAddress })

    history.push(route)

    expect(getPrefixedSafeAddressFromUrl()).toStrictEqual({ shortName, safeAddress: validSafeAddress })
  })
  it('returns the current chain prefix with safe address when only the address is in the url', () => {
    jest.doMock('src/routes/routes', () => ({
      ...jest.requireActual('src/routes/routes'),
      history: { location: { pathname: `/${validSafeAddress}/balances` } },
    }))

    expect(getPrefixedSafeAddressFromUrl()).toStrictEqual({ shortName: 'test', safeAddress: validSafeAddress })
  })
})

describe('hasPrefixedSafeAddressInUrl', () => {
  it('returns true if the chain-specific address exists in the URL', () => {
    history.push(`/rin:${validSafeAddress}`)

    expect(hasPrefixedSafeAddressInUrl()).toBe(true)
  })

  it('returns false if the chain-specific address in the URL is malformed', () => {
    history.push(`/n0TaR3aLSHORTname:4xIOHAS89asasd`)

    expect(hasPrefixedSafeAddressInUrl()).toBe(false)
  })

  it("returns false if the chain-specific address does't exist in the URL", () => {
    history.push(WELCOME_ROUTE)

    expect(hasPrefixedSafeAddressInUrl()).toBe(false)
  })
})

// Not testing getShortChainNameFromUrl or getSafeAddressFromUrl because
// they return from { [key]: getPrefixedSafeAddressFromUrl()[key] }

describe('getPrefixedSafeAddressSlug', () => {
  it('returns a chain-specific address slug with provided safeAddress/shortName', () => {
    const shortName = 'rin'

    const slug = getPrefixedSafeAddressSlug({ shortName, safeAddress: validSafeAddress })

    expect(slug).toBe(`${shortName}:${validSafeAddress}`)
  })
  it('returns the current URL/config chain shortName is none is given', () => {
    const shortName = 'eth'

    jest.doMock('src/routes/routes', () => ({
      ...jest.requireActual('src/routes/routes'),
      history: { location: { pathname: `/${shortName}:0xFak3Addr35s` } },
    }))

    const slug = getPrefixedSafeAddressSlug({ safeAddress: validSafeAddress })

    expect(slug).toBe(`${shortName}:${validSafeAddress}`)
  })
  it('returns the safe address from the URL and current URL/config chain short name without arguments', () => {
    const shortName = 'bnb'
    const fakeAddress = '0xFak3Addr35s'

    jest.doMock('src/routes/routes', () => ({
      ...jest.requireActual('src/routes/routes'),
      history: { location: { pathname: `/${shortName}:${fakeAddress}` } },
    }))

    const slug = getPrefixedSafeAddressSlug()

    expect(slug).toBe(`${shortName}:${fakeAddress}`)
  })
})

describe('generateSafeRoute', () => {
  it('adds the chain-specific slug to provided routes', () => {
    const shortName = 'rin'

    const SAFE_ROUTE_WITH_ADDRESS = generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
      shortName,
      safeAddress: validSafeAddress,
    })

    expect(SAFE_ROUTE_WITH_ADDRESS).toBe(`/${shortName}:${validSafeAddress}/balances`)
  })
})

describe('getAllSafeRoutesWithPrefixedAddress', () => {
  it('generates all SAFE_ROUTES with given chain-specific arguments', () => {
    const shortName = 'rin'

    const SAFE_ROUTES_WITH_ADDRESS = getAllSafeRoutesWithPrefixedAddress({
      shortName,
      safeAddress: validSafeAddress,
    })

    const hasAllPrefixedSafeAddressesRoutes = Object.values(SAFE_ROUTES_WITH_ADDRESS).every((route) =>
      route.includes(`${shortName}:${validSafeAddress}`),
    )

    expect(hasAllPrefixedSafeAddressesRoutes).toBe(true)
  })
})
