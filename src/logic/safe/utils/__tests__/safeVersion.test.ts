import { getSafeSingletonDeployment } from '@gnosis.pm/safe-deployments'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { emptyChainInfo } from 'src/config/cache/chains'
import { checkIfSafeNeedsUpdate, hasFeature, isValidMasterCopy } from 'src/logic/safe/utils/safeVersion'

jest.mock('src/logic/contracts/safeContracts', () => ({
  getMasterCopyAddressFromProxyAddress: jest.fn(),
}))

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
    const safeContracts = require('src/logic/contracts/safeContracts')

    it('returns true for L1 mastercopy in L1 chain', async () => {
      safeContracts.getMasterCopyAddressFromProxyAddress.mockReturnValue(
        getSafeSingletonDeployment()?.networkAddresses['1'],
      )
      const isValid = await isValidMasterCopy(
        { ...emptyChainInfo, chainId: '1', l2: false },
        '0x0000000000000000000000000000000000000001',
        '1.3.0',
      )
      expect(isValid).toBe(true)
    })

    it('returns false for L1 mastercopy in L2 chain and version >=1.3.0', async () => {
      safeContracts.getMasterCopyAddressFromProxyAddress.mockReturnValue(
        getSafeSingletonDeployment()?.networkAddresses['100'],
      )
      const isValid = await isValidMasterCopy(
        { ...emptyChainInfo, chainId: '100', l2: true },
        '0x0000000000000000000000000000000000000001',
        '1.3.0',
      )
      expect(isValid).toBe(false)
    })

    it('returns true for L1 mastercopy in L2 chain and version <1.3.0', async () => {
      safeContracts.getMasterCopyAddressFromProxyAddress.mockReturnValue(
        getSafeSingletonDeployment()?.networkAddresses['100'],
      )
      const isValid = await isValidMasterCopy(
        { ...emptyChainInfo, chainId: '100', l2: true },
        '0x0000000000000000000000000000000000000001',
        '1.1.0',
      )
      expect(isValid).toBe(true)
    })
  })
})
