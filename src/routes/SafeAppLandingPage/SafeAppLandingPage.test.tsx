import * as safeAppsGatewaySDK from '@gnosis.pm/safe-react-gateway-sdk'

import SafeAppLandingPage from './SafeAppLandingPage'
import { render, screen, waitFor, waitForElementToBeRemoved } from 'src/utils/test-utils'
import { history, SAFE_ROUTES, OPEN_SAFE_ROUTE, WELCOME_ROUTE } from 'src/routes/routes'
import * as appUtils from 'src/routes/safe/components/Apps/utils'
import { FETCH_STATUS } from 'src/utils/requests'
import { saveToStorage } from 'src/utils/storage'
import { CHAIN_ID } from 'src/config/chain.d'

const SAFE_APP_URL_FROM_CONFIG_SERVICE = 'https://safe-app.gnosis-safe.io/test-safe-app-from-config-service'
const SAFE_APP_URL_FROM_MANIFEST = 'https://safe-app.gnosis-safe.io/test-safe-app-from-manifest'
const SAFE_APP_CHAIN_ID = CHAIN_ID.RINKEBY

describe('<SafeAppLandingPage>', () => {
  beforeEach(() => {
    // mocking safe apps list from the Config Service endpoint
    jest.spyOn(safeAppsGatewaySDK, 'getSafeApps').mockReturnValue(
      Promise.resolve([
        {
          id: 36,
          url: SAFE_APP_URL_FROM_CONFIG_SERVICE,
          name: 'Test App safe from config service',
          iconUrl: 'icon/logo.svg',
          description: 'Test Safe App description from config service',
          chainIds: [CHAIN_ID.RINKEBY, '1'], // available chains Ethereum & Rinkeby
          provider: undefined,
          accessControl: {
            type: safeAppsGatewaySDK.SafeAppAccessPolicyTypes.NoRestrictions,
          },
        },
      ]),
    )

    // mocking the Safe App details from manifest.json
    jest.spyOn(appUtils, 'getAppInfoFromUrl').mockReturnValue(
      Promise.resolve({
        id: '36',
        url: SAFE_APP_URL_FROM_MANIFEST,
        name: 'Test App safe from manifest',
        iconUrl: 'icon/logo.svg',
        error: false,
        description: 'Test Safe App description from manifest',
        chainIds: [],
        provider: undefined,
        fetchStatus: FETCH_STATUS.SUCCESS,
        accessControl: {
          type: safeAppsGatewaySDK.SafeAppAccessPolicyTypes.NoRestrictions,
        },
      }),
    )

    saveToStorage(appUtils.PINNED_SAFE_APP_IDS, [])
    saveToStorage(appUtils.APPS_STORAGE_KEY, [])
  })

  it('Renders the SafeAppLandingPage Page if a valid share safe app link is provided (Safe App details from the Config Service)', async () => {
    const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}&chainId=${SAFE_APP_CHAIN_ID}`

    history.push(SHARE_SAFE_APP_LINK)

    render(<SafeAppLandingPage />)

    // shows a Loader
    const loaderNode = screen.getByRole('progressbar')
    expect(loaderNode).toBeInTheDocument()

    // when the Loader is removed we show the Safe App details (name, description & available chains)
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))
    expect(screen.getByText('Test App safe from config service')).toBeInTheDocument()
    expect(screen.getByText('Test Safe App description from config service')).toBeInTheDocument()
    expect(screen.getByText('Available networks')).toBeInTheDocument()
    expect(screen.getByText('Rinkeby')).toBeInTheDocument()
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
  })

  it('Renders the SafeAppLandingPage Page if a valid share safe app link is provided (Safe App details from Manifest)', async () => {
    const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_MANIFEST}&chainId=${SAFE_APP_CHAIN_ID}`

    history.push(SHARE_SAFE_APP_LINK)

    render(<SafeAppLandingPage />)

    // shows a Loader
    const loaderNode = screen.getByRole('progressbar')
    expect(loaderNode).toBeInTheDocument()

    // when the Loader is removed we show the Safe App details (name & description)
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))
    expect(screen.getByText('Test App safe from manifest')).toBeInTheDocument()
    expect(screen.getByText('Test Safe App description from manifest')).toBeInTheDocument()
    expect(screen.queryByText('Available networks')).not.toBeInTheDocument()
  })

  it('Renders connect wallet button if no user wallet is connected', async () => {
    const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_MANIFEST}&chainId=${SAFE_APP_CHAIN_ID}`

    history.push(SHARE_SAFE_APP_LINK)

    render(<SafeAppLandingPage />)

    // shows a Loader
    const loaderNode = screen.getByRole('progressbar')
    expect(loaderNode).toBeInTheDocument()

    // when the Loader is removed we show the Connect Wallet button
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('Renders the create new safe button if the user wallet is connected', async () => {
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
        network: CHAIN_ID.RINKEBY,
      },
    }
    const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_MANIFEST}&chainId=${SAFE_APP_CHAIN_ID}`

    history.push(SHARE_SAFE_APP_LINK)

    render(<SafeAppLandingPage />, customState)

    // shows a Loader
    const loaderNode = screen.getByRole('progressbar')
    expect(loaderNode).toBeInTheDocument()

    // when the Loader is removed we show the create new safe button
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))
    const createNewSafeLinkNode = screen.getByText('Create new Safe').closest('a')
    const openSafeRouteWithRedirect = `${OPEN_SAFE_ROUTE}?redirect=${encodeURIComponent(
      `${SAFE_ROUTES.APPS}?appUrl=${SAFE_APP_URL_FROM_MANIFEST}`,
    )}`

    expect(createNewSafeLinkNode).toHaveAttribute('href', openSafeRouteWithRedirect)
  })

  it('Redirects to the Demo Safe App', async () => {
    const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_MANIFEST}&chainId=${SAFE_APP_CHAIN_ID}`

    history.push(SHARE_SAFE_APP_LINK)

    render(<SafeAppLandingPage />)

    // shows a Loader
    const loaderNode = screen.getByRole('progressbar')
    expect(loaderNode).toBeInTheDocument()

    // when the Loader is removed we show the Try Demo button
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

    const createTryDemoLinkNode = screen.getByText('Try Demo').closest('a')

    const demoSafeAppUrl = '/eth:0xfF501B324DC6d78dC9F983f140B9211c3EdB4dc7/apps'
    expect(createTryDemoLinkNode).toHaveAttribute('href', `${demoSafeAppUrl}?appUrl=${SAFE_APP_URL_FROM_MANIFEST}`)
  })

  it('Redirects to the Welcome Page if no Chain Id is provided in the query params', async () => {
    history.push(`share/safe-app?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}`)

    render(<SafeAppLandingPage />)

    await waitFor(() => {
      expect(window.location.pathname).toBe(WELCOME_ROUTE)
    })
  })

  it('Redirects to the Welcome Page if no valid Chain Id is provided in the query params', async () => {
    const invalidChainId = 'invalid_chain_id'
    history.push(`share/safe-app?chainId=${invalidChainId}`)

    render(<SafeAppLandingPage />)

    await waitFor(() => {
      expect(window.location.pathname).toBe(WELCOME_ROUTE)
    })
  })

  it('Redirects to the Welcome Page if no Safe App url is provided in the query params', async () => {
    history.push(`share/safe-app?chainId=${SAFE_APP_CHAIN_ID}`)

    render(<SafeAppLandingPage />)

    await waitFor(() => {
      expect(window.location.pathname).toBe(WELCOME_ROUTE)
    })
  })

  it('Redirects to the Welcome Page if Safe App details are missing and load Manifest.json fails', async () => {
    // load manifest.json failed
    jest.spyOn(appUtils, 'getAppInfoFromUrl').mockReturnValue(Promise.reject({}))

    const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_MANIFEST}&chainId=${SAFE_APP_CHAIN_ID}`

    history.push(SHARE_SAFE_APP_LINK)

    render(<SafeAppLandingPage />)

    // shows a Loader
    const loaderNode = screen.getByRole('progressbar')
    expect(loaderNode).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.pathname).toBe(WELCOME_ROUTE)
    })
  })
})
