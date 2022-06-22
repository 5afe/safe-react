import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

import { ChainId } from 'src/config/chain.d'
import { buildSafeOwners, extractRemoteSafeInfo, canExecuteCreatedTx } from 'src/logic/safe/store/actions/utils'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { getMockedSafeInstance, getMockedStoredTServiceModel } from 'src/test/utils/safeHelper'
import { LocalTransactionStatus } from '../../models/types/gateway.d'
import {
  inMemoryPartialSafeInformation,
  localSafesInfo,
  remoteSafeInfoWithModules,
  remoteSafeInfoWithoutModules,
} from '../mocks/safeInformation'

const lastTxFromStore = getMockedStoredTServiceModel()

describe('canExecuteCreatedTx', () => {
  it('It should return false if given a safe with a threshold > 1', async () => {
    // given
    const nonce = '0'
    const threshold = '2'
    const safeInstance = getMockedSafeInstance({ threshold })

    // when
    const result = await canExecuteCreatedTx(safeInstance, nonce, lastTxFromStore)

    // then
    expect(result).toBe(false)
  })
  it('It should return true if given a safe with a threshold === 1 and the previous transaction is already executed', async () => {
    // given
    const nonce = '1'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold, nonce })
    const lastTxFromStoreExecuted = { ...lastTxFromStore, txStatus: LocalTransactionStatus.SUCCESS }

    // when
    const result = await canExecuteCreatedTx(safeInstance, nonce, lastTxFromStoreExecuted)

    // then
    expect(result).toBe(true)
  })
  it('It should return true if given a safe with a threshold === 1 and the previous transaction is already executed', async () => {
    // given
    const nonce = '10'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold, nonce })
    const lastTxFromStoreExecuted = { ...lastTxFromStore, txStatus: LocalTransactionStatus.SUCCESS }

    // when
    const result = await canExecuteCreatedTx(safeInstance, nonce, lastTxFromStoreExecuted)

    // then
    expect(result).toBe(true)
  })
  it('It should return false if given a safe with a threshold === 1 and the previous transaction is not yet executed', async () => {
    // given
    const nonce = '10'
    const threshold = '1'
    const safeInstance = getMockedSafeInstance({ threshold })
    const lastTxFromStoreExecuted = { ...lastTxFromStore, txStatus: LocalTransactionStatus.FAILED }

    // when
    const result = await canExecuteCreatedTx(safeInstance, nonce, lastTxFromStoreExecuted)

    // then
    expect(result).toBe(false)
  })
})

jest.mock('axios')
jest.mock('console')

jest.mock('src/logic/safe/utils/spendingLimits')
describe('extractRemoteSafeInfo', () => {
  afterAll(() => {
    jest.unmock('src/logic/safe/utils/spendingLimits')
  })

  it('should build a Partial SafeRecord without modules information', async () => {
    const extractedRemoteSafeInfo: Partial<SafeRecordProps> = {
      chainId: '4' as ChainId,
      collectiblesTag: '1634550387',
      modules: undefined,
      spendingLimits: undefined,
      nonce: 492,
      threshold: 2,
      txHistoryTag: '1633430459',
      txQueuedTag: '1634550387',
      currentVersion: '1.3.0',
      needsUpdate: false,
      guard: undefined,
      featuresEnabled: [
        'CONTRACT_INTERACTION',
        'DOMAIN_LOOKUP',
        'EIP1559',
        'ERC721',
        'SAFE_APPS',
        'SAFE_TX_GAS_OPTIONAL',
        'SPENDING_LIMIT',
      ] as FEATURES[],
      implementation: {
        value: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        name: 'Gnosis Safe: Mastercopy 1.3.0',
        logoUri:
          'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0x3E5c63644E683549055b9Be8653de26E0B4CD36E.png',
      },
    }

    const remoteSafeInfo = await extractRemoteSafeInfo(remoteSafeInfoWithoutModules as any)

    expect(remoteSafeInfo).toStrictEqual(extractedRemoteSafeInfo)
  })

  it('should build a Partial SafeRecord with modules information', async () => {
    const spendingLimits = require('src/logic/safe/utils/spendingLimits')
    spendingLimits.getSpendingLimits.mockImplementationOnce(async () => inMemoryPartialSafeInformation.spendingLimits)

    const extractedRemoteSafeInfo: Partial<SafeRecordProps> = {
      chainId: '4' as ChainId,
      collectiblesTag: '1634550387',
      modules: inMemoryPartialSafeInformation.modules as SafeRecordProps['modules'],
      spendingLimits: inMemoryPartialSafeInformation.spendingLimits,
      nonce: 492,
      threshold: 2,
      txHistoryTag: '1633430459',
      txQueuedTag: '1634550387',
      currentVersion: '1.3.0',
      needsUpdate: false,
      guard: '0x4f8a82d73729A33E0165aDeF3450A7F85f007528',
      featuresEnabled: [
        'CONTRACT_INTERACTION',
        'DOMAIN_LOOKUP',
        'EIP1559',
        'ERC721',
        'SAFE_APPS',
        'SAFE_TX_GAS_OPTIONAL',
        'SPENDING_LIMIT',
      ] as FEATURES[],
      implementation: {
        value: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        name: 'Gnosis Safe: Mastercopy 1.3.0',
        logoUri:
          'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0x3E5c63644E683549055b9Be8653de26E0B4CD36E.png',
      },
    }

    const remoteSafeInfo = await extractRemoteSafeInfo(remoteSafeInfoWithModules as any)

    expect(remoteSafeInfo).toStrictEqual(extractedRemoteSafeInfo)
  })
})

describe('buildSafeOwners', () => {
  const SAFE_ADDRESS = '0xe414604Ad49602C0b9c0b08D0781ECF96740786a'

  it('should return `undefined` if no arguments were provided', () => {
    expect(buildSafeOwners()).toBeUndefined()
  })
  it('should return `localSafeOwners` if no `remoteSafeOwners` were provided', () => {
    const expectedOwners = [
      '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
      '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
      '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
      '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
      '0x5e47249883F6a1d639b84e8228547fB289e222b6',
    ]
    expect(buildSafeOwners(remoteSafeInfoWithModules.owners)).toStrictEqual(expectedOwners)
  })
  it('should discard those owners that are not present in `remoteSafeOwners`', () => {
    const localOwners: SafeRecordProps['owners'] = localSafesInfo[SAFE_ADDRESS].owners
    const [, ...remoteOwners] = remoteSafeInfoWithModules.owners
    const expectedOwners = [
      '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
      '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
      '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
      '0x5e47249883F6a1d639b84e8228547fB289e222b6',
    ]

    expect(buildSafeOwners(remoteOwners, localOwners)).toStrictEqual(expectedOwners)
  })
  it('should add those owners that are not present in `localSafeOwners`', () => {
    const localOwners: SafeRecordProps['owners'] = localSafesInfo[SAFE_ADDRESS].owners.slice(0, 4)
    const remoteOwners = remoteSafeInfoWithModules.owners
    const expectedOwners = [
      '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
      '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
      '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
      '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
      '0x5e47249883F6a1d639b84e8228547fB289e222b6',
    ]

    expect(buildSafeOwners(remoteOwners, localOwners)).toStrictEqual(expectedOwners)
  })
  it('should preserve those owners that are present in `remoteSafeOwners` with data present in `localSafeOwners`', () => {
    const localOwners: SafeRecordProps['owners'] = localSafesInfo[SAFE_ADDRESS].owners.slice(0, 4)
    const [, ...remoteOwners] = remoteSafeInfoWithModules.owners
    const expectedOwners = [
      '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
      '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
      '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
      '0x5e47249883F6a1d639b84e8228547fB289e222b6',
    ]

    expect(buildSafeOwners(remoteOwners, localOwners)).toStrictEqual(expectedOwners)
  })
})
