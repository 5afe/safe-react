import * as safeAppsGatewaySDK from '@gnosis.pm/safe-react-gateway-sdk'

import SafeAppLandingPage from './SafeAppLandingPage'
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
  getByRole,
  getByText,
  queryByText,
} from 'src/utils/test-utils'
import { history, SAFE_ROUTES, OPEN_SAFE_ROUTE, WELCOME_ROUTE } from 'src/routes/routes'
import * as appUtils from 'src/routes/safe/components/Apps/utils'
import { FETCH_STATUS } from 'src/utils/requests'
import { saveToStorage, storage } from 'src/utils/storage'
import { CHAIN_ID } from 'src/config/chain.d'
import { getAddressLabel } from 'src/components/SafeAddressSelector/SafeAddressSelector'

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
          chainIds: [CHAIN_ID.RINKEBY, CHAIN_ID.ETHEREUM], // available chains Ethereum & Rinkeby
          provider: undefined,
          accessControl: {
            type: safeAppsGatewaySDK.SafeAppAccessPolicyTypes.NoRestrictions,
          },
          tags: [],
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
        tags: [],
      }),
    )

    saveToStorage(appUtils.PINNED_SAFE_APP_IDS, [])
    saveToStorage(appUtils.APPS_STORAGE_KEY, [])
  })

  it('Renders the SafeAppLandingPage Page if a valid link is provided (Safe App details from the Config Service)', async () => {
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

  it('Renders the SafeAppLandingPage Page if a valid link is provided (Safe App details from Manifest)', async () => {
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

  it('Renders connect wallet button if user wallet is not connected', async () => {
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

  it('Renders the create new safe button if the user wallet is connected and no compatible safe is present', async () => {
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

    const historySpy = jest.spyOn(history, 'push')

    fireEvent.click(screen.getByText('Try Demo'))

    const demoSafeAppUrl = '/eth:0xfF501B324DC6d78dC9F983f140B9211c3EdB4dc7/apps'

    await waitFor(() => {
      expect(historySpy).toHaveBeenCalledWith(`${demoSafeAppUrl}?appUrl=${SAFE_APP_URL_FROM_MANIFEST}`)

      historySpy.mockRestore()
    })
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

  describe('Compatible User Safe Addresses', () => {
    const ownerAccount = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
    const ownedSafe1 = '0x9AbC8ed0237fCaB91EF5B6a8B14b8e0FEC9d44db' // from service (Rinkeby)
    const ownedSafe2 = '0xdE169a45ED4b076f328EFed20912Cd9880a7D138' // from service (Rinkeby)
    const storedSafe = '0x127068C4860c1cBA1df1C925aC1EE3eCE2C334C7' // stored in local storage (Mainnet)
    const incompatibleSafe = '0xa78174CD714f98DB9123990401bE63914024Ef79' // incompatible Safe stored in local storage (Polygon)

    afterEach(() => {
      // clean local storage
      storage.setItem('_immortal|v2_RINKEBY__SAFES', {})
      storage.setItem('_immortal|v2_MAINNET__SAFES', {})
      storage.setItem('_immortal|v2_POLYGON__SAFES', {})
    })

    it('Selects the last Safe used in the provided chain as a default option', async () => {
      // mocked owned safes from service
      jest.spyOn(safeAppsGatewaySDK, 'getOwnedSafes').mockReturnValue(
        Promise.resolve({
          safes: [ownedSafe1, ownedSafe2],
        }),
      )

      // safes defined in the localstorage
      storage.setItem('_immortal|v2_RINKEBY__SAFES', {
        [ownedSafe1]: { address: ownedSafe1, chainId: CHAIN_ID.RINKEBY, owners: [ownerAccount] },
      })

      storage.setItem('_immortal|v2_MAINNET__SAFES', {
        [storedSafe]: { address: storedSafe, chainId: CHAIN_ID.ETHEREUM, owners: [ownerAccount] },
      })

      storage.setItem('_immortal|v2_POLYGON__SAFES', {
        [incompatibleSafe]: { address: incompatibleSafe, chainId: CHAIN_ID.POLYGON, owners: [ownerAccount] },
      })

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: ownerAccount,
          network: CHAIN_ID.RINKEBY,
        },
        addressBook: [
          {
            address: ownedSafe1,
            name: 'First test Safe',
            chainId: CHAIN_ID.RINKEBY,
          },
        ],
        currentSession: {
          viewedSafes: [
            ownedSafe2, // last viewed safe
          ],
          restored: true,
        },
      }

      const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}&chainId=${SAFE_APP_CHAIN_ID}`

      history.push(SHARE_SAFE_APP_LINK)

      render(<SafeAppLandingPage />, customState)

      // shows a Loader
      const loaderNode = screen.getByRole('progressbar')
      expect(loaderNode).toBeInTheDocument()

      // when the Loader is removed check the default safe
      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

      // last viewed safe as default safe
      expect(screen.getByRole('textbox', { hidden: true })).toHaveValue(ownedSafe2)

      const selectorNode = screen.getByTestId('safe-selector')

      // opens the selector
      fireEvent.mouseDown(getByRole(selectorNode, 'button'))

      // selector options open
      const selectorModal = screen.getByRole('presentation')
      expect(selectorModal).toBeInTheDocument()

      // only compatibe safes are present in the options
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe1))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe2))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(storedSafe))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(incompatibleSafe))).not.toBeInTheDocument()

      // redirect button
      const openSafeAppLinkNode = screen.getByText('Connect Safe').closest('a')

      expect(openSafeAppLinkNode).toHaveAttribute(
        'href',
        `/rin:${ownedSafe2}/apps?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}`,
      )
    })

    it('Selects a Safe in the provided chain as a default option if no last viewed Safe is defined', async () => {
      // mocked owned safes from service
      jest.spyOn(safeAppsGatewaySDK, 'getOwnedSafes').mockReturnValue(
        Promise.resolve({
          safes: [ownedSafe1, ownedSafe2],
        }),
      )

      // safes defined in the localstorage
      storage.setItem('_immortal|v2_RINKEBY__SAFES', {
        [ownedSafe1]: { address: ownedSafe1, chainId: CHAIN_ID.RINKEBY, owners: [ownerAccount] },
      })

      storage.setItem('_immortal|v2_MAINNET__SAFES', {
        [storedSafe]: { address: storedSafe, chainId: CHAIN_ID.ETHEREUM, owners: [ownerAccount] },
      })

      storage.setItem('_immortal|v2_POLYGON__SAFES', {
        [incompatibleSafe]: { address: incompatibleSafe, chainId: CHAIN_ID.POLYGON, owners: [ownerAccount] },
      })

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: ownerAccount,
          network: CHAIN_ID.RINKEBY,
        },
        addressBook: [
          {
            address: ownedSafe1,
            name: 'First test Safe',
            chainId: CHAIN_ID.RINKEBY,
          },
        ],
      }

      const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}&chainId=${SAFE_APP_CHAIN_ID}`

      history.push(SHARE_SAFE_APP_LINK)

      render(<SafeAppLandingPage />, customState)

      // shows a Loader
      const loaderNode = screen.getByRole('progressbar')
      expect(loaderNode).toBeInTheDocument()

      // when the Loader is removed check the default safe
      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

      // safe in the same provided chain as default safe
      expect(screen.getByRole('textbox', { hidden: true })).toHaveValue(ownedSafe1)

      const selectorNode = screen.getByTestId('safe-selector')

      // opens the selector
      fireEvent.mouseDown(getByRole(selectorNode, 'button'))

      // selector options open
      const selectorModal = screen.getByRole('presentation')
      expect(selectorModal).toBeInTheDocument()

      // only compatibe safes are present in the options
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe1))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe2))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(storedSafe))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(incompatibleSafe))).not.toBeInTheDocument()

      // redirect button
      const openSafeAppLinkNode = screen.getByText('Connect Safe').closest('a')

      expect(openSafeAppLinkNode).toHaveAttribute(
        'href',
        `/rin:${ownedSafe1}/apps?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}`,
      )
    })

    it('Selects a Safe from local storage if no owned safe is returned from service', async () => {
      // mocked owned safes from service
      jest.spyOn(safeAppsGatewaySDK, 'getOwnedSafes').mockReturnValue(
        Promise.resolve({
          safes: [], // no safes owned by the user
        }),
      )

      // safes defined in the localstorage
      storage.setItem('_immortal|v2_RINKEBY__SAFES', {
        [ownedSafe1]: { address: ownedSafe1, chainId: CHAIN_ID.RINKEBY, owners: [ownerAccount] },
      })

      storage.setItem('_immortal|v2_MAINNET__SAFES', {
        [storedSafe]: { address: storedSafe, chainId: CHAIN_ID.ETHEREUM, owners: [ownerAccount] },
      })

      storage.setItem('_immortal|v2_POLYGON__SAFES', {
        [incompatibleSafe]: { address: incompatibleSafe, chainId: CHAIN_ID.POLYGON, owners: [incompatibleSafe] },
      })

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: ownerAccount,
          network: CHAIN_ID.RINKEBY,
        },
        addressBook: [
          {
            address: ownedSafe1,
            name: 'First test Safe',
            chainId: CHAIN_ID.RINKEBY,
          },
        ],
      }

      const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}&chainId=${SAFE_APP_CHAIN_ID}`

      history.push(SHARE_SAFE_APP_LINK)

      render(<SafeAppLandingPage />, customState)

      // shows a Loader
      const loaderNode = screen.getByRole('progressbar')
      expect(loaderNode).toBeInTheDocument()

      // when the Loader is removed check the default safe
      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

      // safe from local storage as default safe
      expect(screen.getByRole('textbox', { hidden: true })).toHaveValue(ownedSafe1)

      const selectorNode = screen.getByTestId('safe-selector')

      // opens the selector
      fireEvent.mouseDown(getByRole(selectorNode, 'button'))

      // selector options open
      const selectorModal = screen.getByRole('presentation')
      expect(selectorModal).toBeInTheDocument()

      // only compatibe safes are present in the options
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe1))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe2))).not.toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(storedSafe))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(incompatibleSafe))).not.toBeInTheDocument()
    })

    it('Selects a Safe from the service if no safe is defined in the local storage', async () => {
      // mocked owned safes from service
      jest.spyOn(safeAppsGatewaySDK, 'getOwnedSafes').mockReturnValue(
        Promise.resolve({
          safes: [ownedSafe1, ownedSafe2],
        }),
      )

      // safes defined in the localstorage
      storage.setItem('_immortal|v2_RINKEBY__SAFES', {}) // no safes defined in the local storage
      storage.setItem('_immortal|v2_MAINNET__SAFES', {}) // no safes defined in the local storage
      storage.setItem('_immortal|v2_POLYGON__SAFES', {}) // no safes defined in the local storage

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: ownerAccount,
          network: CHAIN_ID.RINKEBY,
        },
      }

      const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}&chainId=${SAFE_APP_CHAIN_ID}`

      history.push(SHARE_SAFE_APP_LINK)

      render(<SafeAppLandingPage />, customState)

      // shows a Loader
      const loaderNode = screen.getByRole('progressbar')
      expect(loaderNode).toBeInTheDocument()

      // when the Loader is removed check the default safe
      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

      // safe from the service as default safe
      expect(screen.getByRole('textbox', { hidden: true })).toHaveValue(ownedSafe1)

      const selectorNode = screen.getByTestId('safe-selector')

      // opens the selector
      fireEvent.mouseDown(getByRole(selectorNode, 'button'))

      // selector options open
      const selectorModal = screen.getByRole('presentation')
      expect(selectorModal).toBeInTheDocument()

      // only compatibe safes are present in the options
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe1))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe2))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(storedSafe))).not.toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(incompatibleSafe))).not.toBeInTheDocument()

      // redirect button
      const openSafeAppLinkNode = screen.getByText('Connect Safe').closest('a')

      expect(openSafeAppLinkNode).toHaveAttribute(
        'href',
        `/rin:${ownedSafe1}/apps?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}`,
      )
    })

    it('Shows Create Safe Button if no Safe is compatible', async () => {
      // mocked owned safes from service
      jest.spyOn(safeAppsGatewaySDK, 'getOwnedSafes').mockReturnValue(
        Promise.resolve({
          safes: [], // no safes owned by the user
        }),
      )

      // safes defined in the localstorage
      storage.setItem('_immortal|v2_RINKEBY__SAFES', {}) // no safes defined in the local storage

      storage.setItem('_immortal|v2_POLYGON__SAFES', {
        [incompatibleSafe]: { address: incompatibleSafe, chainId: CHAIN_ID.POLYGON, owners: [incompatibleSafe] },
      })

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: ownerAccount,
          network: CHAIN_ID.RINKEBY,
        },
      }

      const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}&chainId=${SAFE_APP_CHAIN_ID}`

      history.push(SHARE_SAFE_APP_LINK)

      render(<SafeAppLandingPage />, customState)

      // shows a Loader
      const loaderNode = screen.getByRole('progressbar')
      expect(loaderNode).toBeInTheDocument()

      // when the Loader is removed
      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

      const createNewSafeLinkNode = screen.getByText('Create new Safe').closest('a')

      expect(createNewSafeLinkNode).toBeInTheDocument()
    })

    it('Selects a different Safe in the selector', async () => {
      // mocked owned safes from service
      jest.spyOn(safeAppsGatewaySDK, 'getOwnedSafes').mockReturnValue(
        Promise.resolve({
          safes: [ownedSafe1, ownedSafe2],
        }),
      )

      // safes defined in the localstorage
      storage.setItem('_immortal|v2_RINKEBY__SAFES', {
        [ownedSafe1]: { address: ownedSafe1, chainId: CHAIN_ID.RINKEBY, owners: [ownerAccount] },
      })

      storage.setItem('_immortal|v2_MAINNET__SAFES', {
        [storedSafe]: { address: storedSafe, chainId: CHAIN_ID.ETHEREUM, owners: [ownerAccount] },
      })

      storage.setItem('_immortal|v2_POLYGON__SAFES', {
        [incompatibleSafe]: { address: incompatibleSafe, chainId: CHAIN_ID.POLYGON, owners: [ownerAccount] },
      })

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: ownerAccount,
          network: CHAIN_ID.RINKEBY,
        },
        addressBook: [
          {
            address: ownedSafe1,
            name: 'First test Safe',
            chainId: CHAIN_ID.RINKEBY,
          },
        ],
        currentSession: {
          viewedSafes: [
            ownedSafe2, // last viewed safe
          ],
          restored: true,
        },
      }

      const SHARE_SAFE_APP_LINK = `share/safe-app?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}&chainId=${SAFE_APP_CHAIN_ID}`

      history.push(SHARE_SAFE_APP_LINK)

      render(<SafeAppLandingPage />, customState)

      // shows a Loader
      const loaderNode = screen.getByRole('progressbar')
      expect(loaderNode).toBeInTheDocument()

      // when the Loader is removed check the default safe
      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

      // last viewed safe as default safe
      expect(screen.getByRole('textbox', { hidden: true })).toHaveValue(ownedSafe2)

      const selectorNode = screen.getByTestId('safe-selector')

      // opens the selector
      fireEvent.mouseDown(getByRole(selectorNode, 'button'))

      // selector options open
      const selectorModal = screen.getByRole('presentation')
      expect(selectorModal).toBeInTheDocument()

      // only compatibe safes are present in the options
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe1))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(ownedSafe2))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(storedSafe))).toBeInTheDocument()
      expect(queryByText(selectorModal, getAddressLabel(incompatibleSafe))).not.toBeInTheDocument()

      // redirect button
      const openSafeAppLinkNode = screen.getByText('Connect Safe').closest('a')

      expect(openSafeAppLinkNode).toHaveAttribute(
        'href',
        `/rin:${ownedSafe2}/apps?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}`,
      )

      // we select a different Safe
      fireEvent.click(getByText(selectorModal, getAddressLabel(ownedSafe1)))

      expect(screen.getByRole('textbox', { hidden: true })).toHaveValue(ownedSafe1)

      expect(openSafeAppLinkNode).toHaveAttribute(
        'href',
        `/rin:${ownedSafe1}/apps?appUrl=${SAFE_APP_URL_FROM_CONFIG_SERVICE}`,
      )
    })
  })
})
