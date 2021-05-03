import axios from 'axios'
import { List } from 'immutable'

import { FEATURES } from 'src/config/networks/network.d'
import {
  buildSafeOwners,
  extractRemoteSafeInfo,
  getLastTx,
  getNewTxNonce,
  shouldExecuteTransaction,
} from 'src/logic/safe/store/actions/utils'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import { SafeOwner, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { buildTxServiceUrl } from 'src/logic/safe/transactions'
import { getMockedSafeInstance, getMockedTxServiceModel } from 'src/test/utils/safeHelper'
import {
  inMemoryPartialSafeInformation,
  localSafesInfo,
  remoteSafeInfoWithModules,
  remoteSafeInfoWithoutModules,
} from '../mocks/safeInformation'

describe('shouldExecuteTransaction', () => {
  it('It should return false if given a safe with a threshold > 1', async () => {
    // given
    const nonce = '0'
    const threshold = '2'
    const safeInstance = getMockedSafeInstance({ threshold })
    const lastTx = getMockedTxServiceModel({})

    // when
    const result = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // then
    expect(result).toBe(false)
  })
  it('It should return true if given a safe with a threshold === 1 and the previous transaction is already executed', async () => {
    // given
    const nonce = '1'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold, nonce })
    const lastTx = getMockedTxServiceModel({})

    // when
    const result = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // then
    expect(result).toBe(true)
  })
  it('It should return true if given a safe with a threshold === 1 and the previous transaction is already executed', async () => {
    // given
    const nonce = '10'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold, nonce })
    const lastTx = getMockedTxServiceModel({ isExecuted: true })

    // when
    const result = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // then
    expect(result).toBe(true)
  })
  it('It should return false if given a safe with a threshold === 1 and the previous transaction is not yet executed', async () => {
    // given
    const nonce = '10'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold })
    const lastTx = getMockedTxServiceModel({ isExecuted: false })

    // when
    const result = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // then
    expect(result).toBe(false)
  })
})

describe('getNewTxNonce', () => {
  it('It should return 2 if given the last transaction with nonce 1', async () => {
    // given
    const safeInstance = getMockedSafeInstance({})
    const lastTx = getMockedTxServiceModel({ nonce: 1 })
    const expectedResult = '2'

    // when
    const result = await getNewTxNonce(lastTx, safeInstance)

    // then
    expect(result).toBe(expectedResult)
  })
  it('It should return 0 if given a safe with nonce 0 and no transactions should use safe contract instance for retrieving nonce', async () => {
    // given
    const safeNonce = '0'
    const safeInstance = getMockedSafeInstance({ nonce: safeNonce })
    const expectedResult = '0'
    const mockFnCall = jest.fn().mockImplementation(() => safeNonce)
    const mockFnNonce = jest.fn().mockImplementation(() => ({ call: mockFnCall }))

    safeInstance.methods.nonce = mockFnNonce

    // when
    const result = await getNewTxNonce(null, safeInstance)

    // then
    expect(result).toBe(expectedResult)
    expect(mockFnNonce).toHaveBeenCalled()
    expect(mockFnCall).toHaveBeenCalled()
    mockFnNonce.mockRestore()
    mockFnCall.mockRestore()
  })
  it('Given a Safe and the last transaction, should return nonce of the last transaction + 1', async () => {
    // given
    const safeInstance = getMockedSafeInstance({})
    const expectedResult = '11'
    const lastTx = getMockedTxServiceModel({ nonce: 10 })

    // when
    const result = await getNewTxNonce(lastTx, safeInstance)

    // then
    expect(result).toBe(expectedResult)
  })
})

jest.mock('axios')
jest.mock('console')
describe('getLastTx', () => {
  afterAll(() => {
    jest.unmock('axios')
    jest.unmock('console')
  })
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  it('It should return the last transaction for a given a safe address', async () => {
    // given
    const lastTx = getMockedTxServiceModel({ nonce: 1 })
    const url = buildTxServiceUrl(safeAddress)

    // when
    // @ts-ignore
    axios.get.mockImplementationOnce(() => {
      return {
        data: {
          results: [lastTx],
        },
      }
    })

    const result = await getLastTx(safeAddress)

    // then
    expect(result).toStrictEqual(lastTx)
    expect(axios.get).toHaveBeenCalled()
    expect(axios.get).toBeCalledWith(url, { params: { limit: 1 } })
  })
  it('If should return null If catches an error getting last transaction', async () => {
    // given
    const lastTx = null
    const url = buildTxServiceUrl(safeAddress)

    // when
    // @ts-ignore
    axios.get.mockImplementationOnce(() => {
      throw new Error()
    })
    console.error = jest.fn()
    const result = await getLastTx(safeAddress)
    const spyConsole = jest.spyOn(console, 'error').mockImplementation()

    // then
    expect(result).toStrictEqual(lastTx)
    expect(axios.get).toHaveBeenCalled()
    expect(axios.get).toBeCalledWith(url, { params: { limit: 1 } })
    expect(spyConsole).toHaveBeenCalled()
  })
})

jest.mock('src/logic/safe/utils/spendingLimits')
describe('extractRemoteSafeInfo', () => {
  afterAll(() => {
    jest.unmock('src/logic/safe/utils/spendingLimits')
  })

  it('should build a Partial SafeRecord without modules information', async () => {
    const extractedRemoteSafeInfo: Partial<SafeRecordProps> = {
      modules: undefined,
      spendingLimits: undefined,
      nonce: 492,
      threshold: 2,
      currentVersion: '1.1.1',
      needsUpdate: false,
      featuresEnabled: [FEATURES.ERC721, FEATURES.ERC1155, FEATURES.SAFE_APPS, FEATURES.CONTRACT_INTERACTION],
    }

    const remoteSafeInfo = await extractRemoteSafeInfo(remoteSafeInfoWithoutModules)

    expect(remoteSafeInfo).toStrictEqual(extractedRemoteSafeInfo)
  })

  it('should build a Partial SafeRecord with modules information', async () => {
    const spendingLimits = require('src/logic/safe/utils/spendingLimits')
    spendingLimits.getSpendingLimits.mockImplementationOnce(async () => inMemoryPartialSafeInformation.spendingLimits)

    const extractedRemoteSafeInfo: Partial<SafeRecordProps> = {
      modules: inMemoryPartialSafeInformation.modules as SafeRecordProps['modules'],
      spendingLimits: inMemoryPartialSafeInformation.spendingLimits,
      nonce: 492,
      threshold: 2,
      currentVersion: '1.1.1',
      needsUpdate: false,
      featuresEnabled: [FEATURES.ERC721, FEATURES.ERC1155, FEATURES.SAFE_APPS, FEATURES.CONTRACT_INTERACTION],
    }

    const remoteSafeInfo = await extractRemoteSafeInfo(remoteSafeInfoWithModules)

    expect(remoteSafeInfo).toStrictEqual(extractedRemoteSafeInfo)
  })
})

describe('buildSafeOwners', () => {
  const SAFE_ADDRESS = '0xe414604Ad49602C0b9c0b08D0781ECF96740786a'

  it('should return `undefined` if no arguments were provided', () => {
    expect(buildSafeOwners()).toBeUndefined()
  })
  it('should return `localSafeOwners` if no `remoteSafeOwners` were provided', () => {
    const expectedOwners = List(
      [
        { address: '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875' },
        { address: '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F' },
        { address: '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47' },
        { address: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2' },
        { address: '0x5e47249883F6a1d639b84e8228547fB289e222b6' },
      ].map(makeOwner),
    )
    expect(buildSafeOwners(remoteSafeInfoWithModules.owners)).toStrictEqual(expectedOwners)
  })
  it('should discard those owners that are not present in `remoteSafeOwners`', () => {
    const localOwners: List<SafeOwner> = List(localSafesInfo[SAFE_ADDRESS].owners.map(makeOwner))
    const [, ...remoteOwners] = remoteSafeInfoWithModules.owners
    const expectedOwners = List(
      [
        {
          name: 'UNKNOWN',
          address: '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
        },
        {
          name: 'UNKNOWN',
          address: '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
        },
        {
          name: 'Owner B',
          address: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
        },
        {
          name: 'Owner A',
          address: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
        },
      ].map(makeOwner),
    )

    expect(buildSafeOwners(remoteOwners, localOwners)).toStrictEqual(expectedOwners)
  })
  it('should add those owners that are not present in `localSafeOwners`', () => {
    const localOwners: List<SafeOwner> = List(localSafesInfo[SAFE_ADDRESS].owners.slice(0, 4).map(makeOwner))
    const remoteOwners = remoteSafeInfoWithModules.owners
    const expectedOwners = List(
      [
        {
          name: 'UNKNOWN',
          address: '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
        },
        {
          name: 'UNKNOWN',
          address: '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
        },
        {
          name: 'UNKNOWN',
          address: '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
        },
        {
          name: 'Owner B',
          address: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
        },
        {
          name: 'UNKNOWN',
          address: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
        },
      ].map(makeOwner),
    )

    expect(buildSafeOwners(remoteOwners, localOwners)).toStrictEqual(expectedOwners)
  })
  it('should preserve those owners that are present in `remoteSafeOwners` with data present in `localSafeOwners`', () => {
    const localOwners: List<SafeOwner> = List(localSafesInfo[SAFE_ADDRESS].owners.slice(0, 4).map(makeOwner))
    const [, ...remoteOwners] = remoteSafeInfoWithModules.owners
    const expectedOwners = List(
      [
        {
          name: 'UNKNOWN',
          address: '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
        },
        {
          name: 'UNKNOWN',
          address: '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
        },
        {
          name: 'Owner B',
          address: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
        },
        {
          name: 'UNKNOWN',
          address: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
        },
      ].map(makeOwner),
    )

    expect(buildSafeOwners(remoteOwners, localOwners)).toStrictEqual(expectedOwners)
  })
})
