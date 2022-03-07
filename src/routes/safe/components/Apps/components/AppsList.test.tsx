import * as safeAppsGatewaySDK from '@gnosis.pm/safe-react-gateway-sdk'

import AppsList, { PINNED_APPS_LIST_TEST_ID, ALL_APPS_LIST_TEST_ID } from './AppsList'
import { render, screen, fireEvent, within, act, waitFor } from 'src/utils/test-utils'
import * as appUtils from 'src/routes/safe/components/Apps/utils'
import { FETCH_STATUS } from 'src/utils/requests'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import * as googleAnalytics from 'src/utils/googleAnalytics'

jest.mock('src/routes/routes', () => {
  const original = jest.requireActual('src/routes/routes')
  return {
    ...original,
    extractSafeAddress: () => '0xbc2BB26a6d821e69A38016f3858561a1D80d4182',
  }
})

const spyTrackEventGA = jest.fn()

beforeEach(() => {
  // Includes an id that doesn't exist in the remote apps to check that there's no error
  saveToStorage(appUtils.PINNED_SAFE_APP_IDS, ['14', '24', '228'])

  // populate custom app
  saveToStorage(appUtils.APPS_STORAGE_KEY, [
    {
      url: 'https://apps.gnosis-safe.io/drain-safe',
    },
  ])

  jest.spyOn(googleAnalytics, 'useAnalytics').mockImplementation(() => ({
    trackPage: jest.fn(),
    trackEvent: spyTrackEventGA,
  }))

  jest.spyOn(appUtils, 'getAppInfoFromUrl').mockReturnValueOnce(
    Promise.resolve({
      id: '36',
      url: 'https://apps.gnosis-safe.io/drain-safe',
      name: 'Drain safe',
      iconUrl: 'https://apps.gnosis-safe.io/drain-safe/logo.svg',
      error: false,
      description: 'Transfer all your assets in batch',
      chainIds: ['4'],
      provider: undefined,
      fetchStatus: FETCH_STATUS.SUCCESS,
      accessControl: {
        type: safeAppsGatewaySDK.SafeAppAccessPolicyTypes.NoRestrictions,
      },
    }),
  )

  jest.spyOn(safeAppsGatewaySDK, 'getSafeApps').mockReturnValueOnce(
    Promise.resolve([
      {
        id: 13,
        url: 'https://cloudflare-ipfs.com/ipfs/QmX31xCdhFDmJzoVG33Y6kJtJ5Ujw8r5EJJBrsp8Fbjm7k',
        name: 'Compound',
        iconUrl: 'https://cloudflare-ipfs.com/ipfs/QmX31xCdhFDmJzoVG33Y6kJtJ5Ujw8r5EJJBrsp8Fbjm7k/Compound.png',
        description: 'Money markets on the Ethereum blockchain',
        chainIds: ['1', '4'],
        provider: undefined,
        accessControl: {
          type: safeAppsGatewaySDK.SafeAppAccessPolicyTypes.NoRestrictions,
        },
      },
      {
        id: 3,
        url: 'https://app.ens.domains',
        name: 'ENS App',
        iconUrl: 'https://app.ens.domains/android-chrome-144x144.png',

        description: 'Decentralised naming for wallets, websites, & more.',
        chainIds: ['1', '4'],
        provider: undefined,
        accessControl: {
          type: safeAppsGatewaySDK.SafeAppAccessPolicyTypes.DomainAllowlist,
          value: ['https://gnosis-safe.io'],
        },
      },
      {
        id: 14,
        url: 'https://cloudflare-ipfs.com/ipfs/QmXLxxczMH4MBEYDeeN9zoiHDzVkeBmB5rBjA3UniPEFcA',
        name: 'Synthetix',
        iconUrl: 'https://cloudflare-ipfs.com/ipfs/QmXLxxczMH4MBEYDeeN9zoiHDzVkeBmB5rBjA3UniPEFcA/Synthetix.png',
        description: 'Trade synthetic assets on Ethereum',
        chainIds: ['1', '4'],
        provider: undefined,
        accessControl: {
          type: safeAppsGatewaySDK.SafeAppAccessPolicyTypes.NoRestrictions,
        },
      },
      {
        id: 24,
        url: 'https://cloudflare-ipfs.com/ipfs/QmdVaZxDov4bVARScTLErQSRQoxgqtBad8anWuw3YPQHCs',
        name: 'Transaction Builder',
        iconUrl: 'https://cloudflare-ipfs.com/ipfs/QmdVaZxDov4bVARScTLErQSRQoxgqtBad8anWuw3YPQHCs/tx-builder.png',
        description: 'A Safe app to compose custom transactions',
        chainIds: ['1', '4', '56', '100', '137', '246', '73799'],
        provider: undefined,
        accessControl: {
          type: safeAppsGatewaySDK.SafeAppAccessPolicyTypes.DomainAllowlist,
          value: ['https://gnosis-safe.io'],
        },
      },
    ]),
  )
})

describe('Safe Apps -> AppsList', () => {
  it('Shows apps from the Remote app list', async () => {
    render(<AppsList />)

    await waitFor(() => {
      expect(screen.getByText('Compound')).toBeInTheDocument()
      expect(screen.getByText('ENS App')).toBeInTheDocument()
    })
  })

  it('Shows apps from the Custom app list', async () => {
    render(<AppsList />)

    await waitFor(() => {
      expect(screen.getByText('Drain safe')).toBeInTheDocument()
    })
  })

  it('Shows different app sections', async () => {
    render(<AppsList />)

    await waitFor(() => {
      expect(screen.getByText('ALL APPS')).toBeInTheDocument()
      expect(screen.getByText('BOOKMARKED APPS')).toBeInTheDocument()
      expect(screen.getByText('CUSTOM APPS')).toBeInTheDocument()
    })
  })
})

describe('Safe Apps -> AppsList -> Search', () => {
  it('Shows apps matching the search query', async () => {
    render(<AppsList />)

    const searchInput = await waitFor(() => screen.getByPlaceholderText('e.g Compound'))

    fireEvent.input(searchInput, { target: { value: 'Compound' } })

    expect(screen.getByText('Compound')).toBeInTheDocument()
    expect(screen.queryByText('ENS App')).not.toBeInTheDocument()
  })

  it('Shows app matching the name first for a query that matches in name and description of multiple apps', async () => {
    render(<AppsList />)

    const searchInput = await waitFor(() => screen.getByPlaceholderText('e.g Compound'))

    fireEvent.input(searchInput, { target: { value: 'Tra' } })

    // matches the name
    const transactionBuilder = screen.getByText('Transaction Builder')
    // matches the description (synthetix)
    const synthetix = screen.getByText('Trade synthetic assets on Ethereum')
    // query the dom for ordered array of matches
    const results = screen.queryAllByText(/Tra/)

    expect(results[0]).toBe(transactionBuilder)
    expect(results[1]).toBe(synthetix)
  })

  it('Shows "no apps found" message when not able to find apps matching the query and a button to search for the WalletConnect Safe app', async () => {
    render(<AppsList />)

    const query = 'not-a-real-app'
    const searchInput = await waitFor(() => screen.getByPlaceholderText('e.g Compound'))

    fireEvent.input(searchInput, { target: { value: query } })

    expect(screen.getByText(/No apps found matching/)).toBeInTheDocument()

    const button = screen.getByText('Search WalletConnect')
    fireEvent.click(button)

    expect((searchInput as HTMLInputElement).value).toBe('WalletConnect')
  })

  it('Clears the search result when you press on clear button and shows all apps again', async () => {
    render(<AppsList />)

    const searchInput = await waitFor(() => screen.getByPlaceholderText('e.g Compound'))
    fireEvent.input(searchInput, { target: { value: 'Compound' } })

    const clearButton = screen.getByLabelText('Clear the search')
    fireEvent.click(clearButton)

    expect((searchInput as HTMLInputElement).value).toBe('')
  })

  it("Doesn't display custom/pinned apps irrelevant to the search (= hides pinned/custom sections)", async () => {
    render(<AppsList />)

    const searchInput = await waitFor(() => screen.getByPlaceholderText('e.g Compound'))

    fireEvent.input(searchInput, { target: { value: 'Compound' } })

    expect(screen.queryByText('Drain Safe')).not.toBeInTheDocument()
    expect(screen.queryByText('Transaction builder')).not.toBeInTheDocument()
  })

  it('Hides pinned/custom sections when you search', async () => {
    render(<AppsList />)

    const searchInput = await waitFor(() => screen.getByPlaceholderText('e.g Compound'))

    fireEvent.input(searchInput, { target: { value: 'Compound' } })

    expect(screen.queryByText('PINNED APPS')).not.toBeInTheDocument()
    expect(screen.queryByText('CUSTOM APPS')).not.toBeInTheDocument()
  })
})

describe('Safe Apps -> AppsList -> Pinning apps', () => {
  it('Shows a tutorial message when there are no pinned apps', async () => {
    saveToStorage(appUtils.PINNED_SAFE_APP_IDS, [])

    render(<AppsList />)

    const tut = await waitFor(() =>
      screen.getByText(
        (content) =>
          content.startsWith('Simply hover over an app and click on the') &&
          content.endsWith('to bookmark the app here for convenient access'),
      ),
    )
    expect(tut).toBeInTheDocument()
  })

  it('allows to pin and unpin an app', async () => {
    render(<AppsList />)

    // check the app is not pinned
    await waitFor(() => {
      expect(within(screen.getByTestId(PINNED_APPS_LIST_TEST_ID)).queryByText('Compound')).not.toBeInTheDocument()
    })

    expect(spyTrackEventGA).not.toHaveBeenCalled()

    const allAppsContainer = screen.getByTestId(ALL_APPS_LIST_TEST_ID)
    const compoundAppPinBtn = within(allAppsContainer).getByLabelText('Pin Compound')
    act(() => {
      fireEvent.click(compoundAppPinBtn)
    })

    await waitFor(() => {
      expect(within(screen.getByTestId(PINNED_APPS_LIST_TEST_ID)).getByText('Compound')).toBeInTheDocument()
      expect(within(screen.getByTestId(PINNED_APPS_LIST_TEST_ID)).getByLabelText('Unpin Compound')).toBeInTheDocument()
      expect(spyTrackEventGA).toHaveBeenCalledWith({
        action: 'Pin',
        category: 'Safe App',
        label: 'Compound',
      })
    })

    const compoundAppUnpinBtn = within(screen.getByTestId(PINNED_APPS_LIST_TEST_ID)).getByLabelText('Unpin Compound')
    act(() => {
      fireEvent.click(compoundAppUnpinBtn)
    })

    await waitFor(() => {
      expect(within(screen.getByTestId(PINNED_APPS_LIST_TEST_ID)).queryByText('Compound')).not.toBeInTheDocument()
      expect(spyTrackEventGA).toHaveBeenCalledWith({
        action: 'Unpin',
        category: 'Safe App',
        label: 'Compound',
      })
    })
  })

  // see #2847 for more info
  it('Removes pinned Safe Apps from localStorage when they are not included in the remote list', async () => {
    const defaultPinnedAppsInLocalStorage = loadFromStorage<string[]>(appUtils.PINNED_SAFE_APP_IDS)
    expect(defaultPinnedAppsInLocalStorage).toContain('14')
    expect(defaultPinnedAppsInLocalStorage).toContain('24')
    expect(defaultPinnedAppsInLocalStorage).toContain('228')

    render(<AppsList />)
    await waitFor(() => {
      expect(screen.getByText('ALL APPS')).toBeInTheDocument()
      expect(screen.getByText('BOOKMARKED APPS')).toBeInTheDocument()
      expect(screen.getByText('CUSTOM APPS')).toBeInTheDocument()
    })

    // after that the localStorage should be updated
    const updatedPinnedAppsInLocalStorage = loadFromStorage<string[]>(appUtils.PINNED_SAFE_APP_IDS)

    // '228' App id should be removed from pinnedApps ['14', '24', '228'] because is not included in the remote list
    expect(updatedPinnedAppsInLocalStorage).toContain('14')
    expect(updatedPinnedAppsInLocalStorage).toContain('24')
    expect(updatedPinnedAppsInLocalStorage).not.toContain('228')
  })
})
