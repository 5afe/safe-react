import * as TagManager from 'react-gtm-module'
import { matchPath } from 'react-router-dom'
import { renderHook } from '@testing-library/react-hooks'

import { history } from 'src/routes/routes'
import { getAnonymizedLocation, usePageTracking, GTM_EVENT } from 'src/utils/googleTagManager'
import { waitFor } from '@testing-library/react'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  matchPath: jest.fn(),
}))

describe('googleTagManager', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })
  describe('getAnonymizedLocation', () => {
    it('anonymizes routes with Safe addresses', () => {
      ;(matchPath as jest.Mock).mockImplementation(() => ({
        isExact: false,
        path: '',
        url: '',
        params: {
          prefixedSafeAddress: '0x0000000000000000000000000000000000000000',
        },
      }))

      const anonymizedLocation = getAnonymizedLocation({
        pathname: '/rin/0x0000000000000000000000000000000000000000',
        search: '?test=true',
        hash: '#hash',
        state: null,
      })

      expect(anonymizedLocation).toBe('/rin/SAFE_ADDRESS?test=true#hash')
    })
    it('anonymizes transaction ids', () => {
      ;(matchPath as jest.Mock).mockImplementation(() => ({
        isExact: false,
        path: '',
        url: '',
        params: {
          prefixedSafeAddress: '0x0000000000000000000000000000000000000000',
          safeTxHash: '0x73e9512853f394f4c3485752a56806f61a5a0a98d8c13877ee3e7ae5d2769d2b',
        },
      }))

      const anonymizedLocation = getAnonymizedLocation({
        pathname:
          '/rin/0x0000000000000000000000000000000000000000/transactions/0x73e9512853f394f4c3485752a56806f61a5a0a98d8c13877ee3e7ae5d2769d2b',
        search: '?test=true',
        hash: '#hash',
        state: null,
      })

      expect(anonymizedLocation).toBe('/rin/SAFE_ADDRESS/transactions/TRANSACTION_ID?test=true#hash')
    })
    it("doesn't anonymize other links", () => {
      ;(matchPath as jest.Mock).mockImplementation(() => ({
        isExact: false,
        path: '',
        url: '',
        params: {},
      }))

      const anonymizedLocation = getAnonymizedLocation({
        pathname: '/other/test/link',
        search: '?test=true',
        hash: '#hash',
        state: null,
      })

      expect(anonymizedLocation).toBe('/other/test/link?test=true#hash')
    })
  })
  describe('loadGoogleTagManager', () => {
    it('prevents init without a gtm id/auth', () => {
      jest.doMock('src/utils/constants.ts', () => ({
        GOOGLE_TAG_MANAGER_ID: '',
        GOOGLE_TAG_MANAGER_DEVELOPMENT_AUTH: '',
      }))

      const mockInitialize = jest.fn()
      jest.doMock('react-gtm-module', () => ({
        initialize: mockInitialize,
      }))

      // doMock doesn't hoist
      const { loadGoogleTagManager } = require('src/utils/googleTagManager')
      loadGoogleTagManager()

      expect(mockInitialize).not.toHaveBeenCalled()
    })
    it('inits gtm with a pageview event', () => {
      jest.doMock('src/utils/constants.ts', () => ({
        GOOGLE_TAG_MANAGER_ID: 'id123',
        GOOGLE_TAG_MANAGER_DEVELOPMENT_AUTH: 'auth123',
      }))

      jest.doMock('src/config', () => ({
        _getChainId: jest.fn(() => '4'),
      }))

      const mockInitialize = jest.fn()
      jest.doMock('react-gtm-module', () => ({
        initialize: mockInitialize,
      }))

      // doMock doesn't hoist
      const { loadGoogleTagManager } = require('src/utils/googleTagManager')
      loadGoogleTagManager()

      expect(mockInitialize).toHaveBeenCalledWith({
        gtmId: 'id123',
        auth: 'auth123',
        preview: 'env-3',
        dataLayer: {
          event: 'pageview',
          chainId: '4',
          page: '/',
        },
      })
    })
  })
  describe('usePageTracking', () => {
    it('dispatches a pageview event on page change', () => {
      const dataLayerSpy = jest.spyOn(TagManager.default, 'dataLayer').mockImplementation(jest.fn())

      const { waitFor } = renderHook(() => usePageTracking())

      waitFor(() => {
        expect(dataLayerSpy).toHaveBeenCalledWith({
          dataLayer: {
            event: 'pageview',
            chainId: '4',
            page: '/',
          },
        })
      })

      history.push('/test1')
      history.push('/test2')
      history.push('/test3')

      waitFor(() => {
        expect(dataLayerSpy).toHaveBeenCalledTimes(4)
      })
    })
  })
  describe('trackEvent', () => {
    it('tracks a correctly formed event from the arguments', async () => {
      const mockDataLayer = jest.fn()
      jest.doMock('react-gtm-module', () => ({
        dataLayer: mockDataLayer,
      }))

      // doMock doesn't hoist
      const { trackEvent } = require('src/utils/googleTagManager')
      trackEvent({
        event: 'testEvent' as GTM_EVENT,
        category: 'unit-test',
        action: 'Track event',
        label: 1,
      })

      await waitFor(() => {
        expect(mockDataLayer).toHaveBeenCalledWith({
          dataLayer: {
            event: 'testEvent',
            chainId: '4',
            eventCategory: 'unit-test',
            eventAction: 'Track event',
            eventLabel: 1,
          },
        })
      })
    })
  })
})
