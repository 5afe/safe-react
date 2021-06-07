// --no-ignore
import axios from 'axios'
import { Map } from 'immutable'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { buildSafe, fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import * as storageUtils from 'src/utils/storage'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { DEFAULT_SAFE_INITIAL_STATE } from 'src/logic/safe/store/reducer/safe'
import { inMemoryPartialSafeInformation, localSafesInfo, remoteSafeInfoWithoutModules } from '../mocks/safeInformation'

jest.mock('axios')
jest.mock('src/utils/storage/index')
describe('buildSafe', () => {
  const SAFE_ADDRESS = '0xe414604Ad49602C0b9c0b08D0781ECF96740786a'
  const mockedAxios = axios as jest.Mocked<typeof axios>
  const storageUtil = require('src/utils/storage/index') as jest.Mocked<typeof storageUtils>

  afterAll(() => {
    jest.unmock('axios')
    jest.unmock('src/utils/storage/index')
  })

  // ToDo: use a property other than `name`
  it.skip('should return a Partial SafeRecord with a mix of remote and local safe info', async () => {
    mockedAxios.get.mockImplementationOnce(async () => ({ data: remoteSafeInfoWithoutModules }))
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
    mockedAxios.get.mockImplementationOnce(async () => {
      throw new Error('-- test -- no resource available')
    })
    storageUtil.loadFromStorage.mockImplementationOnce(async () => localSafesInfo)

    const builtSafe = await buildSafe(SAFE_ADDRESS)

    expect(builtSafe).toStrictEqual({ ...inMemoryPartialSafeInformation })
  })
  it.skip('should return a Partial SafeRecord when `localSafeInfo` is not present', async () => {
    mockedAxios.get.mockImplementationOnce(async () => ({ data: remoteSafeInfoWithoutModules }))
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
      featuresEnabled: ['ERC721', 'ERC1155', 'SAFE_APPS', 'CONTRACT_INTERACTION'],
    })
  })
  it.skip('should return a Partial SafeRecord with only `address` and `name` keys if it fails to recover info', async () => {
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    mockedAxios.get.mockImplementationOnce(async () => {
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
  const mockedAxios = axios as jest.Mocked<typeof axios>
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  afterAll(() => {
    jest.unmock('axios')
    jest.unmock('src/utils/storage/index')
  })
  it('should create UPDATE_SAFE with remoteSafeInfo', async () => {
    mockedAxios.get.mockImplementationOnce(async () => ({ data: remoteSafeInfoWithoutModules }))
    const expectedActions = [
      {
        type: UPDATE_SAFE,
        payload: {
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
          featuresEnabled: ['ERC721', 'ERC1155', 'SAFE_APPS', 'CONTRACT_INTERACTION'],
        },
      },
    ]

    const store = mockStore(
      Map({
        defaultSafe: DEFAULT_SAFE_INITIAL_STATE,
        safes: Map(),
        latestMasterContractVersion: '',
      }),
    )
    await store.dispatch(fetchSafe(SAFE_ADDRESS))

    expect(store.getActions()).toEqual(expectedActions)
  })
  it('should dispatch an updateSafe with only `address` if `remoteSafeInfo` is not present', async () => {
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    mockedAxios.get.mockImplementationOnce(async () => {
      throw new Error('-- test -- no resource available')
    })
    const expectedActions = [{ type: UPDATE_SAFE, payload: { address: SAFE_ADDRESS } }]

    const store = mockStore(
      Map({
        defaultSafe: DEFAULT_SAFE_INITIAL_STATE,
        safes: Map(),
        latestMasterContractVersion: '',
      }),
    )
    await store.dispatch(fetchSafe(SAFE_ADDRESS))

    expect(store.getActions()).toEqual(expectedActions)
  })
})
