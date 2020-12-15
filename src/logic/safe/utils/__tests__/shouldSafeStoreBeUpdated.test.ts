import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { List, Set, Map } from 'immutable'
import { shouldSafeStoreBeUpdated } from 'src/logic/safe/utils/shouldSafeStoreBeUpdated'

const getMockedOldSafe = ({
  address,
  needsUpdate,
  balances,
  recurringUser,
  blacklistedAssets,
  blacklistedTokens,
  activeAssets,
  activeTokens,
  owners,
  featuresEnabled,
  currentVersion,
  latestIncomingTxBlock,
  ethBalance,
  threshold,
  name,
  nonce,
  modules,
  spendingLimits,
}: Partial<SafeRecordProps>): SafeRecordProps => {
  const owner1 = {
    name: 'MockedOwner1',
    address: '0x3bE3c2dE077FBC409ae50AFFA66a94a9aE669A8d',
  }
  const owner2 = {
    name: 'MockedOwner2',
    address: '0xA2366b0c2607de70777d87aCdD1D22F0708fA6a3',
  }
  const mockedActiveTokenAddress1 = '0x36591cd3DA96b21Ac9ca54cFaf80fe45107294F1'
  const mockedActiveTokenAddress2 = '0x92aF97cbF10742dD2527ffaBA70e34C03CFFC2c1'
  const mockedActiveAssetsAddress1 = '0x503ab2a6A70c6C6ec8b25a4C87C784e1c8f8e8CD'
  const mockedActiveAssetsAddress2 = '0xfdd4E685361CB7E89a4D27e03DCd0001448d731F'
  const mockedBlacklistedTokenAddress1 = '0xc7d892dca37a244Fb1A7461e6141e58Ead460282'
  const mockedBlacklistedAssetAddress1 = '0x0ac539137c4c99001f16Dd132E282F99A02Ddc3F'

  return {
    name: name || 'MockedSafe',
    address: address || '0xAE173F30ec9A293d37c44BA68d3fCD35F989Ce9F',
    threshold: threshold || 2,
    ethBalance: ethBalance || '10',
    owners: owners || List([owner1, owner2]),
    modules: modules || [],
    spendingLimits: spendingLimits || [],
    activeTokens: activeTokens || Set([mockedActiveTokenAddress1, mockedActiveTokenAddress2]),
    activeAssets: activeAssets || Set([mockedActiveAssetsAddress1, mockedActiveAssetsAddress2]),
    blacklistedTokens: blacklistedTokens || Set([mockedBlacklistedTokenAddress1]),
    blacklistedAssets: blacklistedAssets || Set([mockedBlacklistedAssetAddress1]),
    balances:
      balances ||
      Map({
        [mockedActiveTokenAddress1]: '100',
        [mockedActiveTokenAddress2]: '10',
      }),
    nonce: nonce || 2,
    latestIncomingTxBlock: latestIncomingTxBlock || 1,
    recurringUser: recurringUser || false,
    currentVersion: currentVersion || 'v1.1.1',
    needsUpdate: needsUpdate || false,
    featuresEnabled: featuresEnabled || [],
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
  it(`Given an old safe and a new name for the safe, should return true`, () => {
    // given
    const oldName = 'oldName'
    const newName = 'newName'
    const oldSafe = getMockedOldSafe({ name: oldName })
    const newSafeProps: Partial<SafeRecordProps> = {
      name: newName,
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
    const owner1 = {
      name: 'MockedOwner1',
      address: '0x3bE3c2dE077FBC409ae50AFFA66a94a9aE669A8d',
    }
    const owner2 = {
      name: 'MockedOwner2',
      address: '0xA2366b0c2607de70777d87aCdD1D22F0708fA6a3',
    }
    const oldSafe = getMockedOldSafe({ owners: List([owner1, owner2]) })
    const newSafeProps: Partial<SafeRecordProps> = {
      owners: List([owner1]),
    }

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
    const newSafeProps: Partial<SafeRecordProps> = {
      modules: newModulesList,
    }

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
    const newSafeProps: Partial<SafeRecordProps> = {
      modules: newSpendingLimitsList,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old activeTokens list and a new activeTokens list for the safe, should return true`, () => {
    // given
    const mockedActiveTokenAddress1 = '0x36591cd3DA96b21Ac9ca54cFaf80fe45107294F1'
    const mockedActiveTokenAddress2 = '0x92aF97cbF10742dD2527ffaBA70e34C03CFFC2c1'
    const oldActiveTokens = Set([mockedActiveTokenAddress1, mockedActiveTokenAddress2])
    const newActiveTokens = Set([mockedActiveTokenAddress1])
    const oldSafe = getMockedOldSafe({ activeTokens: oldActiveTokens })
    const newSafeProps: Partial<SafeRecordProps> = {
      activeTokens: newActiveTokens,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old activeAssets list and a new activeAssets list for the safe, should return true`, () => {
    // given
    const mockedActiveTokenAddress1 = '0x36591cd3DA96b21Ac9ca54cFaf80fe45107294F1'
    const mockedActiveTokenAddress2 = '0x92aF97cbF10742dD2527ffaBA70e34C03CFFC2c1'
    const oldActiveAssets = Set([mockedActiveTokenAddress1, mockedActiveTokenAddress2])
    const newActiveAssets = Set([mockedActiveTokenAddress1])
    const oldSafe = getMockedOldSafe({ activeAssets: oldActiveAssets })
    const newSafeProps: Partial<SafeRecordProps> = {
      activeAssets: newActiveAssets,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old blacklistedTokens list and a new blacklistedTokens list for the safe, should return true`, () => {
    // given
    const mockedActiveTokenAddress1 = '0x36591cd3DA96b21Ac9ca54cFaf80fe45107294F1'
    const mockedActiveTokenAddress2 = '0x92aF97cbF10742dD2527ffaBA70e34C03CFFC2c1'
    const oldBlacklistedTokens = Set([mockedActiveTokenAddress1, mockedActiveTokenAddress2])
    const newBlacklistedTokens = Set([mockedActiveTokenAddress1])
    const oldSafe = getMockedOldSafe({ blacklistedTokens: oldBlacklistedTokens })
    const newSafeProps: Partial<SafeRecordProps> = {
      blacklistedTokens: newBlacklistedTokens,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old blacklistedAssets list and a new blacklistedAssets list for the safe, should return true`, () => {
    // given
    const mockedActiveTokenAddress1 = '0x36591cd3DA96b21Ac9ca54cFaf80fe45107294F1'
    const mockedActiveTokenAddress2 = '0x92aF97cbF10742dD2527ffaBA70e34C03CFFC2c1'
    const oldBlacklistedAssets = Set([mockedActiveTokenAddress1, mockedActiveTokenAddress2])
    const newBlacklistedAssets = Set([mockedActiveTokenAddress1])
    const oldSafe = getMockedOldSafe({ blacklistedAssets: oldBlacklistedAssets })
    const newSafeProps: Partial<SafeRecordProps> = {
      blacklistedAssets: newBlacklistedAssets,
    }

    // When
    const expectedResult = shouldSafeStoreBeUpdated(newSafeProps, oldSafe)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given an old balances list and a new balances list for the safe, should return true`, () => {
    // given
    const mockedActiveTokenAddress1 = '0x36591cd3DA96b21Ac9ca54cFaf80fe45107294F1'
    const mockedActiveTokenAddress2 = '0x92aF97cbF10742dD2527ffaBA70e34C03CFFC2c1'
    const oldBalances = Map({
      [mockedActiveTokenAddress1]: '100',
      [mockedActiveTokenAddress2]: '10',
    })
    const newBalances = Map({
      [mockedActiveTokenAddress1]: '100',
    })
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
  it(`Given an old newLatestIncomingTxBlock and a new newLatestIncomingTxBlock for the safe, should return true`, () => {
    // given
    const oldLatestIncomingTxBlock = 1
    const newLatestIncomingTxBlock = 2
    const oldSafe = getMockedOldSafe({ latestIncomingTxBlock: oldLatestIncomingTxBlock })
    const newSafeProps: Partial<SafeRecordProps> = {
      latestIncomingTxBlock: newLatestIncomingTxBlock,
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
