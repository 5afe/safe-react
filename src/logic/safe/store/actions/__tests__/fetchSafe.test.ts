import { waitFor } from 'src/utils/test-utils'
import * as GatewaySDK from '@gnosis.pm/safe-react-gateway-sdk'
import { setChainId } from 'src/logic/config/utils'

jest.mock('src/logic/safe/store/actions/transactions/fetchTransactions')
jest.mock('src/logic/collectibles/store/actions/fetchCollectibles')
jest.mock('src/logic/tokens/store/actions/fetchSafeTokens')
jest.mock('src/logic/currentSession/store/actions/addViewedSafe')

jest.mock('src/logic/safe/store/selectors', () => {
  const actual = jest.requireActual('src/logic/safe/store/selectors')
  return {
    __esModule: true,
    ...actual,
    currentSafeWithNames: () => ({
      collectiblesTag: '123',
      txQueuedTag: '123',
      txHistoryTag: '123',
    }),
  }
})

type MockedAction = (callback: () => null) => Promise<unknown>

describe('fetchSafe', () => {
  // Spies
  jest.spyOn(GatewaySDK, 'getSafeInfo')
  jest.spyOn(GatewaySDK, 'getBalances')

  // Mocked modules
  const { default: fetchTransactions } = require('src/logic/safe/store/actions/transactions/fetchTransactions')
  const { fetchCollectibles } = require('src/logic/collectibles/store/actions/fetchCollectibles')
  const { fetchSafeTokens } = require('src/logic/tokens/store/actions/fetchSafeTokens')
  const { default: addViewedSafe } = require('src/logic/currentSession/store/actions/addViewedSafe')

  // Actual fetchSafe function
  const { fetchSafe } = require('src/logic/safe/store/actions/fetchSafe')

  // Test args
  const testAddress = '0xAdCa2CCcF35CbB27fD757f1c0329DF767f8E38F0'
  const chainId = '4'
  const cgwUrl = 'https://safe-client.staging.gnosisdev.com'

  afterEach(() => {
    setChainId(chainId)
  })

  it('fetches a safe for the first time', async () => {
    const action = fetchSafe(testAddress, true)
    await (action as MockedAction)(() => null)

    await waitFor(() => {
      expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(cgwUrl, chainId, testAddress)
      expect(fetchSafeTokens).toHaveBeenCalledWith(testAddress)
      expect(fetchCollectibles).toHaveBeenCalledWith(testAddress)
      expect(fetchTransactions).toHaveBeenCalledWith(chainId, testAddress)
      expect(addViewedSafe).toHaveBeenCalledWith(testAddress) // initial load, so add to last viewed safes
    })
  })

  it('fetches a safe by address', async () => {
    const action = fetchSafe(testAddress, false)
    await (action as MockedAction)(() => null)

    await waitFor(() => {
      expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(cgwUrl, chainId, testAddress)
      expect(fetchSafeTokens).toHaveBeenCalledWith(testAddress)
      expect(fetchCollectibles).toHaveBeenCalledWith(testAddress)
      expect(fetchTransactions).toHaveBeenCalledWith(chainId, testAddress)
      expect(addViewedSafe).not.toHaveBeenCalled() // don't add to last viewed safes when not initial load
    })
  })

  it('ignores fetched safe if chainId has changed', async () => {
    const initialChainId = '100'

    setChainId(initialChainId) // set chainId to 100, but the Safe info will return 4

    const action = fetchSafe(testAddress, false)
    await (action as MockedAction)(() => null)

    await waitFor(() => {
      expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(cgwUrl, initialChainId, testAddress)
      expect(fetchSafeTokens).not.toHaveBeenCalled()
      expect(fetchCollectibles).not.toHaveBeenCalled()
      expect(fetchTransactions).not.toHaveBeenCalled()
      expect(addViewedSafe).not.toHaveBeenCalled() // don't add to last viewed safes when not initial load
    })
  })

  it('ignores fetched safe if chainId has changed', async () => {
    const initialChainId = '100'

    setChainId(initialChainId) // set chainId to 100, but the Safe info will return 4

    const action = fetchSafe(testAddress, false)
    await (action as MockedAction)(() => null)

    await waitFor(() => {
      expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(cgwUrl, initialChainId, testAddress)
      expect(fetchSafeTokens).not.toHaveBeenCalled()
      expect(fetchCollectibles).not.toHaveBeenCalled()
      expect(fetchTransactions).not.toHaveBeenCalled()
      expect(addViewedSafe).not.toHaveBeenCalled() // don't add to last viewed safes when not initial load
    })
  })

  describe('Collectibles/History/Queue cache tags', () => {
    const selectors = require('src/logic/safe/store/selectors')

    it(`doesn't load collectibles if the tag is fresh`, async () => {
      // Set the collectible tag to that of the mocked safe info
      jest.spyOn(selectors, 'currentSafeWithNames').mockImplementation(() => ({
        collectiblesTag: '1629729817',
        txQueuedTag: '123',
        txHistoryTag: '123',
      }))

      const action = fetchSafe(testAddress, false)
      await (action as MockedAction)(() => null)

      await waitFor(() => {
        expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(cgwUrl, chainId, testAddress)
        expect(fetchSafeTokens).toHaveBeenCalledWith(testAddress)
        expect(fetchCollectibles).not.toHaveBeenCalled()
        expect(fetchTransactions).toHaveBeenCalled()
      })
    })

    it(`doesn't load collectibles if the tag hasn't changed`, async () => {
      // Set the collectible tag to that of the mocked safe info
      jest.spyOn(selectors, 'currentSafeWithNames').mockImplementationOnce(() => ({
        collectiblesTag: '1629729817',
        txQueuedTag: '123',
        txHistoryTag: '123',
      }))

      const action = fetchSafe(testAddress, false)
      await (action as MockedAction)(() => null)

      await waitFor(() => {
        expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(cgwUrl, chainId, testAddress)
        expect(fetchSafeTokens).toHaveBeenCalledWith(testAddress)
        expect(fetchCollectibles).not.toHaveBeenCalled()
        expect(fetchTransactions).toHaveBeenCalled()
      })
    })

    it(`loads history if either the queue or history tag has changed`, async () => {
      // Set the collectible tag to that of the mocked safe info
      jest.spyOn(selectors, 'currentSafeWithNames').mockImplementationOnce(() => ({
        collectiblesTag: '123',
        txQueuedTag: '123',
        txHistoryTag: '1629729817',
      }))

      const action = fetchSafe(testAddress, false)
      await (action as MockedAction)(() => null)

      await waitFor(() => {
        expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(cgwUrl, chainId, testAddress)
        expect(fetchSafeTokens).toHaveBeenCalledWith(testAddress)
        expect(fetchCollectibles).toHaveBeenCalled()
        expect(fetchTransactions).toHaveBeenCalled()
      })
    })

    it(`doesn't load history if both history and queue tags haven't changed`, async () => {
      // Set the collectible tag to that of the mocked safe info
      jest.spyOn(selectors, 'currentSafeWithNames').mockImplementationOnce(() => ({
        collectiblesTag: '123',
        txQueuedTag: '1629729817',
        txHistoryTag: '1629729817',
      }))

      const action = fetchSafe(testAddress, false)
      await (action as MockedAction)(() => null)

      await waitFor(() => {
        expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(cgwUrl, chainId, testAddress)
        expect(fetchSafeTokens).toHaveBeenCalledWith(testAddress)
        expect(fetchCollectibles).toHaveBeenCalled()
        expect(fetchTransactions).not.toHaveBeenCalled()
      })
    })
  })
})
