import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import * as GatewaySDK from '@gnosis.pm/safe-react-gateway-sdk'
import { checkIfSafeNeedsUpdate, hasFeature, isValidMasterCopy } from 'src/logic/safe/utils/safeVersion'

describe('Check safe version', () => {
  it('Calls checkIfSafeNeedUpdate, should return true if the safe version is bellow the target one', async () => {
    const safeVersion = '1.0.0'
    const targetVersion = '1.1.1'
    const { needUpdate } = await checkIfSafeNeedsUpdate(safeVersion, targetVersion)
    expect(needUpdate).toEqual(true)
  })
  it('Calls checkIfSafeNeedUpdate, should return false if the safe version is over the target one', async () => {
    const safeVersion = '1.3.0'
    const targetVersion = '1.1.1'
    const { needUpdate } = await checkIfSafeNeedsUpdate(safeVersion, targetVersion)
    expect(needUpdate).toEqual(false)
  })
  it('Calls checkIfSafeNeedUpdate, should return false if the safe version is equal the target one', async () => {
    const safeVersion = '1.1.1'
    const targetVersion = '1.1.1'
    const { needUpdate } = await checkIfSafeNeedsUpdate(safeVersion, targetVersion)
    expect(needUpdate).toEqual(false)
  })

  describe('hasFeature', () => {
    it('returns false for old Safes and SAFE_TX_GAS_OPTIONAL', () => {
      expect(hasFeature(FEATURES.SAFE_TX_GAS_OPTIONAL, '1.1.1')).toBe(false)
    })

    it('returns true for new Safes and SAFE_TX_GAS_OPTIONAL', () => {
      expect(hasFeature(FEATURES.SAFE_TX_GAS_OPTIONAL, '1.3.0')).toBe(true)
    })

    it('returns true for any Safes and SAFE_APPS', () => {
      expect(hasFeature(FEATURES.SAFE_APPS)).toBe(true)
      expect(hasFeature(FEATURES.SAFE_APPS, '1.3.0')).toBe(true)
      expect(hasFeature(FEATURES.SAFE_APPS, '1.1.1')).toBe(true)
    })
  })

  describe('isValidMasterCopy', () => {
    it('returns false if address is not contained in result', async () => {
      jest.spyOn(GatewaySDK, 'getMasterCopies').mockImplementation(() =>
        Promise.resolve([
          {
            address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
            version: '1.3.0',
            deployer: 'Gnosis',
            deployedBlockNumber: 12504268,
            lastIndexedBlockNumber: 14927028,
            l2: false,
          },
        ]),
      )

      const isValid = await isValidMasterCopy('1', '0x0000000000000000000000000000000000000005')
      expect(isValid).toBe(false)
    })

    it('returns true if address is contained in list', async () => {
      jest.spyOn(GatewaySDK, 'getMasterCopies').mockImplementation(() =>
        Promise.resolve([
          {
            address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
            version: '1.3.0',
            deployer: 'Gnosis',
            deployedBlockNumber: 12504268,
            lastIndexedBlockNumber: 14927028,
            l2: false,
          },
          {
            address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
            version: '1.3.0+L2',
            deployer: 'Gnosis',
            deployedBlockNumber: 12504423,
            lastIndexedBlockNumber: 14927028,
            l2: true,
          },
        ]),
      )

      const isValid = await isValidMasterCopy('1', '0x3E5c63644E683549055b9Be8653de26E0B4CD36E')
      expect(isValid).toBe(true)
    })
  })
})
