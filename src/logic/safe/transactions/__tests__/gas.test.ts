import { _getChainId } from 'src/config'
import { CHAIN_ID } from 'src/config/chain.d'

import { setChainId } from 'src/logic/config/utils'
import { createSendParams, estimateSafeTxGas, isMaxFeeParam } from '../gas'
import * as safeVersion from 'src/logic/safe/utils/safeVersion'
import * as safeTxGasEstimation from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

describe('estimateSafeTxGas', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('returns 0 if safeTxGas is optional for current save version', async () => {
    jest.spyOn(safeVersion, 'hasFeature').mockImplementation(() => true)
    const mockParams = {
      safeAddress: ZERO_ADDRESS,
      txData: '',
      txRecipient: '',
      txAmount: '0',
      operation: 0,
    }
    const result = await estimateSafeTxGas(mockParams, 'mockSaveVersion')

    expect(result).toBe('0')
  })

  it('fetches safeTxGas estimation if safeTxGas is required for current save version', async () => {
    jest.spyOn(safeVersion, 'hasFeature').mockImplementation(() => false)
    const spy = jest.spyOn(safeTxGasEstimation, 'fetchSafeTxGasEstimation').mockImplementation(() => {
      return Promise.resolve({
        currentNonce: 1,
        recommendedNonce: 2,
        safeTxGas: '1',
      })
    })

    const mockParams = {
      safeAddress: ZERO_ADDRESS,
      txData: '',
      txRecipient: '',
      txAmount: '0',
      operation: 0,
    }
    const result = await estimateSafeTxGas(mockParams, 'mockSaveVersion')

    expect(result).toBe('1')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('Get gas param', () => {
  let initialNetworkId = CHAIN_ID.RINKEBY
  beforeAll(() => {
    initialNetworkId = _getChainId()
  })
  afterAll(() => {
    setChainId(initialNetworkId)
  })
  describe('isMaxFeeParams tests', () => {
    it('should return maxFeePerGas for Mainnet', () => {
      setChainId(CHAIN_ID.ETHEREUM)
      expect(isMaxFeeParam()).toBe(true)
    })

    it('should return gasPrice for Arbitrum', () => {
      setChainId(CHAIN_ID.ARBITRUM)
      expect(isMaxFeeParam()).toBe(false)
    })

    it('should return maxFeePerGas for Rinkeby', () => {
      setChainId(CHAIN_ID.RINKEBY)
      expect(isMaxFeeParam()).toBe(true)
    })
    it('should return gasPrice for Volta', () => {
      setChainId(CHAIN_ID.VOLTA)
      expect(isMaxFeeParam()).toBe(false)
    })
  })
  describe('createSendParams tests', () => {
    const mockAccount = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
    const mockTxParams = {
      ethGasLimit: '20000',
      ethNonce: '8',
      ethMaxPrioFeeInGWei: '2500000000',
      ethGasPriceInGWei: '200000000000',
    }
    it('should create send params with EIP-1559 gas fields', () => {
      // when
      setChainId(CHAIN_ID.RINKEBY)
      const sendParams = createSendParams(mockAccount, mockTxParams)

      // then
      expect(sendParams).toHaveProperty('from')
      expect(sendParams).toHaveProperty('value')
      expect(sendParams).toHaveProperty('gas')
      expect(sendParams).toHaveProperty('nonce')

      expect(sendParams).toHaveProperty('maxPriorityFeePerGas')
      expect(sendParams).toHaveProperty('maxFeePerGas')

      expect(sendParams).not.toHaveProperty('gasPrice')
    })

    it('should create send params with pre-EIP-1559 gas fields', () => {
      // when
      setChainId(CHAIN_ID.ENERGY_WEB_CHAIN)
      const sendParams = createSendParams(mockAccount, mockTxParams)

      // then
      expect(sendParams).toHaveProperty('from')
      expect(sendParams).toHaveProperty('value')
      expect(sendParams).toHaveProperty('gas')
      expect(sendParams).toHaveProperty('nonce')

      expect(sendParams).not.toHaveProperty('maxPriorityFeePerGas')
      expect(sendParams).not.toHaveProperty('maxFeePerGas')

      expect(sendParams).toHaveProperty('gasPrice')
    })
  })
})
