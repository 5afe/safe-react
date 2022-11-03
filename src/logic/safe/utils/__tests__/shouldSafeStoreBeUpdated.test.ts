import { CHAIN_ID } from 'src/config/chain.d'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { shouldSafeStoreBeUpdated } from 'src/logic/safe/utils/shouldSafeStoreBeUpdated'

const getMockedOldSafe = ({
  address,
  needsUpdate,
  balances,
  recurringUser,
  owners,
  featuresEnabled,
  currentVersion,
  ethBalance,
  threshold,
  nonce,
  modules,
  spendingLimits,
  guard,
}: Partial<SafeRecordProps>): SafeRecordProps => {
  const owner1 = '0x3bE3c2dE077FBC409ae50AFFA66a94a9aE669A8d'
  const owner2 = '0xA2366b0c2607de70777d87aCdD1D22F0708fA6a3'
  const mockedActiveTokenAddress1 = '0x36591cd3DA96b21Ac9ca54cFaf80fe45107294F1'
  const mockedActiveTokenAddress2 = '0x92aF97cbF10742dD2527ffaBA70e34C03CFFC2c1'
  const mockedGuardAddress = '0x4f8a82d73729A33E0165aDeF3450A7F85f007528'

  return {
    address: address || '0xAE173F30ec9A293d37c44BA68d3fCD35F989Ce9F',
    chainId: CHAIN_ID.RINKEBY,
    threshold: threshold || 2,
    ethBalance: ethBalance || '10',
    owners: owners || [owner1, owner2],
    modules: modules || [],
    spendingLimits: spendingLimits || [],
    balances: balances || [
      { tokenAddress: mockedActiveTokenAddress1, tokenBalance: '100' },
      { tokenAddress: mockedActiveTokenAddress2, tokenBalance: '10' },
    ],
    implementation: {
      value: '',
      name: null,
      logoUri: null,
    },
    loaded: true,
    nonce: nonce || 2,
    recurringUser: recurringUser || false,
    currentVersion: currentVersion || 'v1.1.1',
    needsUpdate: needsUpdate || false,
    featuresEnabled: featuresEnabled || [],
    totalFiatBalance: '110',
    loadedViaUrl: false,
    guard: guard || mockedGuardAddress,
    collectiblesTag: '0',
    txQueuedTag: '0',
    txHistoryTag: '0',
  }
}

describe('shouldSafeStoreBeUpdated', () => {
  it(`Given two equal safes, should return false`, () => {
    // given
    const oldSafe = getMockedOldSafe({})

    // When
    const expectedResult = shouldSafeStoreBeUpdated(oldSafe, oldSafe)

    // Then
    expect(expectedResult).toEqual(false)
  })
  it(`Given an old safe and a new address for the safe, should return true`, () => {
    // given
    const oldAddress = '0x123'
    const newAddress = '0x'
    const oldSafe = getMockedOldSafe({ address: oldAddress })
    const newSafeProps: Partial<SafeRecordProps> = {
      address: newAddress,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old safe and a new threshold for the safe, should return true`, () => {
    // given
    const oldThreshold = 1
    const newThreshold = 2
    const oldSafe = getMockedOldSafe({ threshold: oldThreshold })
    const newSafeProps: Partial<SafeRecordProps> = {
      threshold: newThreshold,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old ethBalance and a new ethBalance for the safe, should return true`, () => {
    // given
    const oldEthBalance = '1'
    const newEthBalance = '2'
    const oldSafe = getMockedOldSafe({ ethBalance: oldEthBalance })
    const newSafeProps: Partial<SafeRecordProps> = {
      ethBalance: newEthBalance,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old owners list and a new owners list for the safe, should return true`, () => {
    // given
    const owner1 = '0x3bE3c2dE077FBC409ae50AFFA66a94a9aE669A8d'
    const owner2 = '0xA2366b0c2607de70777d87aCdD1D22F0708fA6a3'
    const oldSafe = getMockedOldSafe({ owners: [owner1, owner2] })
    const newSafeProps: Partial<SafeRecordProps> = { owners: [owner1] }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old modules list and a new modules list for the safe, should return true`, () => {
    // given
    const oldModulesList = []
    const newModulesList = null
    const oldSafe = getMockedOldSafe({ modules: oldModulesList })
    const newSafeProps: Partial<SafeRecordProps> = { modules: newModulesList }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old spendingLimits list and a new spendingLimits list for the safe, should return true`, () => {
    // given
    const oldSpendingLimitsList = []
    const newSpendingLimitsList = null
    const oldSafe = getMockedOldSafe({ spendingLimits: oldSpendingLimitsList })
    const newSafeProps: Partial<SafeRecordProps> = { modules: newSpendingLimitsList }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old balances list and a new balances list for the safe, should return true`, () => {
    // given
    const mockedActiveTokenAddress1 = '0x36591cd3DA96b21Ac9ca54cFaf80fe45107294F1'
    const mockedActiveTokenAddress2 = '0x92aF97cbF10742dD2527ffaBA70e34C03CFFC2c1'
    const oldBalances = [
      { tokenAddress: mockedActiveTokenAddress1, tokenBalance: '100' },
      { tokenAddress: mockedActiveTokenAddress2, tokenBalance: '100' },
    ]
    const newBalances = [{ tokenAddress: mockedActiveTokenAddress1, tokenBalance: '100' }]
    const oldSafe = getMockedOldSafe({ balances: oldBalances })
    const newSafeProps: Partial<SafeRecordProps> = {
      balances: newBalances,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old nonce and a new nonce for the safe, should return true`, () => {
    // given
    const oldNonce = 1
    const newNonce = 2
    const oldSafe = getMockedOldSafe({ nonce: oldNonce })
    const newSafeProps: Partial<SafeRecordProps> = {
      nonce: newNonce,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old recurringUser and a new recurringUser for the safe, should return true`, () => {
    // given
    const oldRecurringUser = true
    const newRecurringUser = false
    const oldSafe = getMockedOldSafe({ recurringUser: oldRecurringUser })
    const newSafeProps: Partial<SafeRecordProps> = {
      recurringUser: newRecurringUser,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old recurringUser and a new recurringUser for the safe, should return true`, () => {
    // given
    const oldCurrentVersion = '1.1.1'
    const newCurrentVersion = '1.0.0'
    const oldSafe = getMockedOldSafe({ currentVersion: oldCurrentVersion })
    const newSafeProps: Partial<SafeRecordProps> = {
      currentVersion: newCurrentVersion,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old needsUpdate and a new needsUpdate for the safe, should return true`, () => {
    // given
    const oldNeedsUpdate = false
    const newNeedsUpdate = true
    const oldSafe = getMockedOldSafe({ needsUpdate: oldNeedsUpdate })
    const newSafeProps: Partial<SafeRecordProps> = {
      needsUpdate: newNeedsUpdate,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old featuresEnabled and a new featuresEnabled for the safe, should return true`, () => {
    // given
    const oldFeaturesEnabled = []
    const newFeaturesEnabled = undefined
    const oldSafe = getMockedOldSafe({ featuresEnabled: oldFeaturesEnabled })
    const newSafeProps: Partial<SafeRecordProps> = {
      featuresEnabled: newFeaturesEnabled,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
})
