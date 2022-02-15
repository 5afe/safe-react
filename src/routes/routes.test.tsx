import {
  generateSafeRoute,
  generatePrefixedAddressRoutes,
  getPrefixedSafeAddressSlug,
  SAFE_ROUTES,
  WELCOME_ROUTE,
  extractPrefixedSafeAddress,
  ADDRESSED_ROUTE,
  history,
  LOAD_SPECIFIC_SAFE_ROUTE,
} from './routes'
import { Route, Switch } from 'react-router'
import { render } from 'src/utils/test-utils'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

const validSafeAddress = '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f'

// Only contains shortNames that are on the CGW staging Django
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

    const { queryByTestId, getByTestId } = render(
      <Switch>
        <Route path={ADDRESSED_ROUTE} render={() => <div data-testid={addressedTestId} />} />
        <Route path={WELCOME_ROUTE} render={() => <div data-testid={welcomeTestId} />} />
      </Switch>,
    )

    history.push(WELCOME_ROUTE)

    expect(queryByTestId(addressedTestId)).toBeNull()
    expect(getByTestId(welcomeTestId)).toBeInTheDocument()
  })
})

describe('extractPrefixedSafeAddress', () => {
  it('returns the chain and address from the url if both supplied', async () => {
    const shortName = 'matic'

    const route = generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, { shortName, safeAddress: validSafeAddress })
    history.push(route)

    expect(extractPrefixedSafeAddress()).toStrictEqual({ shortName, safeAddress: validSafeAddress })
  })

  it('returns the incorrect chain prefix with safe address when an incorrect chain is supplied', () => {
    const fakeChainShortName = 'fakechain'
    const route = `/${fakeChainShortName}:${validSafeAddress}/balances`
    history.push(route)

    expect(extractPrefixedSafeAddress()).toStrictEqual({ shortName: 'fakechain', safeAddress: validSafeAddress })
  })

  // matchPath will fail because of chainSpecificSafeAddressPathRegExp path
  it('returns the chain prefix with empty safe address when a malformed address is supplied', () => {
    const shortName = 'rin'

    const route = `/${shortName}:0xqiwueyrqpwoifnaskjdgafgdsf/balances`
    history.push(route)

    expect(extractPrefixedSafeAddress()).toStrictEqual({ shortName: 'rin', safeAddress: '' })
  })

  it('returns the chain prefix with zero address', () => {
    const shortName = 'eth'

    const route = `/${shortName}:${ZERO_ADDRESS}/balances`
    history.push(route)

    expect(extractPrefixedSafeAddress()).toStrictEqual({ shortName, safeAddress: ZERO_ADDRESS })
  })

  it('extracts address and shortName from a custom route', () => {
    const shortName = 'matic'
    const path = `/load/${shortName}:${ZERO_ADDRESS}`
    history.push(path)

    expect(extractPrefixedSafeAddress(path, LOAD_SPECIFIC_SAFE_ROUTE)).toStrictEqual({
      shortName,
      safeAddress: ZERO_ADDRESS,
    })
  })
})

// Not testing extractShortChainName or extractSafeAddress because
// they return from { [key]: extractPrefixedSafeAddress()[key] }

describe('getPrefixedSafeAddressSlug', () => {
  it('returns a chain-specific address slug with provided safeAddress/shortName', () => {
    const shortName = 'matic'

    const slug = getPrefixedSafeAddressSlug({ shortName, safeAddress: validSafeAddress })

    expect(slug).toBe(`${shortName}:${validSafeAddress}`)
  })

  it('returns the current URL/config chain shortName if none is given', () => {
    const shortName = 'eth'

    const route = `/${shortName}:${ZERO_ADDRESS}`
    history.push(route)

    // Check for route change as function references this
    expect(history.location.pathname).toBe(route)

    const slug = getPrefixedSafeAddressSlug({ safeAddress: validSafeAddress })

    expect(slug).toBe(`${shortName}:${validSafeAddress}`)
  })

  it('returns the safe address from the URL and current URL/config chain short name without arguments', () => {
    const shortName = 'rin'
    const fakeAddress = ZERO_ADDRESS

    const route = `/${shortName}:${fakeAddress}`
    render(<Route path={route} render={() => null} />)
    history.push(route)

    // Check for route change as function references this
    expect(history.location.pathname).toBe(route)

    const slug = getPrefixedSafeAddressSlug()

    expect(slug).toBe(`${shortName}:${fakeAddress}`)
  })
})

describe('generateSafeRoute', () => {
  it('adds the chain-specific slug to provided routes', () => {
    const shortName = 'eth'

    const testSafeRoute = generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
      shortName,
      safeAddress: validSafeAddress,
    })

    expect(testSafeRoute).toBe(`/${shortName}:${validSafeAddress}/balances`)
  })
})

describe('generatePrefixedAddressRoutes', () => {
  it('generates all SAFE_ROUTES with given chain-specific arguments', () => {
    const shortName = 'matic'

    const currentSafeRoutes = generatePrefixedAddressRoutes({
      shortName,
      safeAddress: validSafeAddress,
    })

    const hasAllPrefixedSafeAddressesRoutes = Object.values(currentSafeRoutes).every((route) =>
      route.includes(`${shortName}:${validSafeAddress}`),
    )

    expect(hasAllPrefixedSafeAddressesRoutes).toBe(true)
  })
})
