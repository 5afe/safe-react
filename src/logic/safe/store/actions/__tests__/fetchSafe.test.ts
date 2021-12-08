// --no-ignore
import { Map } from 'immutable'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { buildSafe, fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import * as storageUtils from 'src/utils/storage'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { inMemoryPartialSafeInformation, localSafesInfo, remoteSafeInfoWithoutModules } from '../mocks/safeInformation'
import * as gateway from '@gnosis.pm/safe-react-gateway-sdk'

jest.mock('@gnosis.pm/safe-react-gateway-sdk', () => ({
  __esModule: true,
  getSafeInfo: jest.fn(),
}))

jest.mock('src/utils/storage/index')

describe('buildSafe', () => {
  const SAFE_ADDRESS = '0xe414604Ad49602C0b9c0b08D0781ECF96740786a'
  const mockedGateway = gateway as jest.Mocked<typeof gateway>
  const storageUtil = require('src/utils/storage/index') as jest.Mocked<typeof storageUtils>

  afterAll(() => {
    jest.unmock('@gnosis.pm/safe-react-gateway-sdk')
    jest.unmock('src/utils/storage/index')
  })

  // ToDo: use a property other than `name`
  it.skip('should return a Partial SafeRecord with a mix of remote and local safe info', async () => {
    mockedGateway.getSafeInfo.mockImplementationOnce(async () => remoteSafeInfoWithoutModules as any)
    storageUtil.loadFromStorage.mockImplementationOnce(async () => localSafesInfo)
    const finalValues: Partial<SafeRecordProps> = {
      modules: undefined,
      spendingLimits: undefined,
    }

    const builtSafe = await buildSafe(SAFE_ADDRESS)

    expect(builtSafe).toStrictEqual({ ...inMemoryPartialSafeInformation, ...finalValues })
  })
  it.skip('should return a Partial SafeRecord when `remoteSafeInfo` is not present', async () => {
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    mockedGateway.getSafeInfo.mockImplementationOnce(async () => {
      throw new Error('-- test -- no resource available')
    })
    storageUtil.loadFromStorage.mockImplementationOnce(async () => localSafesInfo)

    const builtSafe = await buildSafe(SAFE_ADDRESS)

    expect(builtSafe).toStrictEqual({ ...inMemoryPartialSafeInformation })
  })
  it.skip('should return a Partial SafeRecord when `localSafeInfo` is not present', async () => {
    mockedGateway.getSafeInfo.mockImplementationOnce(async () => remoteSafeInfoWithoutModules as any)
    storageUtil.loadFromStorage.mockImplementationOnce(async () => undefined)

    const builtSafe = await buildSafe(SAFE_ADDRESS)

    expect(builtSafe).toStrictEqual({
      address: SAFE_ADDRESS,
      threshold: 2,
      owners: [
        '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
        '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
        '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
        '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
        '0x5e47249883F6a1d639b84e8228547fB289e222b6',
      ],
      modules: undefined,
      spendingLimits: undefined,
      nonce: 492,
      currentVersion: '1.1.1',
      needsUpdate: false,
      featuresEnabled: ['ERC721', 'SAFE_APPS', 'CONTRACT_INTERACTION'],
    })
  })
  it.skip('should return a Partial SafeRecord with only `address` and `name` keys if it fails to recover info', async () => {
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    mockedGateway.getSafeInfo.mockImplementationOnce(async () => {
      throw new Error('-- test -- no resource available')
    })
    const finalValues: Partial<SafeRecordProps> = {
      address: SAFE_ADDRESS,
      owners: undefined,
    }
    storageUtil.loadFromStorage.mockImplementationOnce(async () => undefined)

    const builtSafe = await buildSafe(SAFE_ADDRESS)

    expect(builtSafe).toStrictEqual(finalValues)
  })
})

describe('fetchSafe', () => {
  const SAFE_ADDRESS = '0xe414604Ad49602C0b9c0b08D0781ECF96740786a'
  const mockedGateway = gateway as jest.Mocked<typeof gateway>
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  afterAll(() => {
    jest.unmock('@gnosis.pm/safe-react-gateway-sdk')
    jest.unmock('src/utils/storage/index')
  })
  it('should create UPDATE_SAFE with remoteSafeInfo', async () => {
    mockedGateway.getSafeInfo.mockImplementationOnce(async () => remoteSafeInfoWithoutModules as any)
    const expectedActions = [
      {
        type: UPDATE_SAFE,
        payload: {
          address: SAFE_ADDRESS,
          chainId: '4',
          collectiblesTag: '1634550387',
          guard: undefined,
          threshold: 2,
          txHistoryTag: '1633430459',
          txQueuedTag: '1634550387',
          owners: [
            '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
            '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
            '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
            '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
            '0x5e47249883F6a1d639b84e8228547fB289e222b6',
          ],
          modules: undefined,
          spendingLimits: undefined,
          nonce: 492,
          currentVersion: '1.3.0',
          needsUpdate: false,
          featuresEnabled: [
            'CONTRACT_INTERACTION',
            'DOMAIN_LOOKUP',
            'EIP1559',
            'ERC721',
            'SAFE_APPS',
            'SAFE_TX_GAS_OPTIONAL',
            'SPENDING_LIMIT',
          ],
        },
      },
    ]

    const store = mockStore(
      Map({
        safes: Map(),
        latestMasterContractVersion: '',
      }),
    )
    await store.dispatch(fetchSafe(SAFE_ADDRESS))

    expect(store.getActions()).toEqual(expectedActions)
  })
  it('should not dispatch updateSafe if `remoteSafeInfo` is not present', async () => {
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    mockedGateway.getSafeInfo.mockImplementationOnce(async () => {
      throw new Error('-- test -- no resource available')
    })
    const expectedActions = []

    const store = mockStore(
      Map({
        safes: Map(),
        latestMasterContractVersion: '',
      }),
    )
    await store.dispatch(fetchSafe(SAFE_ADDRESS))

    expect(store.getActions()).toEqual(expectedActions)
  })
})
