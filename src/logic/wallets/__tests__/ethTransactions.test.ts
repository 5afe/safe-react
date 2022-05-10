import { setMaxPrioFeePerGas, getFeesPerGas } from 'src/logic/wallets/ethTransactions'

describe('setMaxPrioFeePerGas', () => {
  it('should return maxPriorityFeePerGas input if less than/equal to maxFeePerGas', () => {
    expect(setMaxPrioFeePerGas(10, 20)).toEqual(10)
    expect(setMaxPrioFeePerGas(20, 20)).toEqual(20)
  })
  it('should return maxFeePerGas input if maxPriorityFeePerGas is greater', () => {
    expect(setMaxPrioFeePerGas(30, 20)).toEqual(20)
  })
})

describe('getFeeHistory', () => {
  const web3 = require('src/logic/wallets/getWeb3')
  const web3Utils = require('web3-utils')

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should return the default maxFeePerGas/maxPriorityFeeGas if getFeeHistory threw', async () => {
    jest.spyOn(web3, 'getWeb3ReadOnly').mockImplementationOnce(() => ({
      eth: {
        getFeeHistory: jest.fn(() => {
          throw new Error()
        }),
      },
    }))

    expect(await getFeesPerGas()).toStrictEqual({
      maxFeePerGas: 3.5e9,
      maxPriorityFeePerGas: 2.5e9,
    })
  })
  it('should return the default maxFeePerGas/maxPriorityFeeGas if hexToNumber threw', async () => {
    jest.spyOn(web3Utils, 'hexToNumber').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(await getFeesPerGas()).toStrictEqual({
      maxFeePerGas: 3.5e9,
      maxPriorityFeePerGas: 2.5e9,
    })
  })
  it('should return the default maxFeePerGas/maxPriorityFeeGas if maxPriorityFeePerGas is not a number', async () => {
    jest.spyOn(web3, 'getWeb3ReadOnly').mockImplementationOnce(() => ({
      eth: {
        getFeeHistory: jest.fn(() => {
          return {
            baseFeePerGas: ['0xc86b1ba', '0xc35e3b0'],
            gasUsedRatio: [0.39920479014424254],
            oldestBlock: '0x9a9e7a',
            reward: [['not a hex value']],
          }
        }),
      },
    }))

    expect(await getFeesPerGas()).toStrictEqual({
      maxFeePerGas: 3.5e9,
      maxPriorityFeePerGas: 2.5e9,
    })
  })
  it('should return the default maxFeePerGas/maxPriorityFeeGas if baseFeePerGas is not a number', async () => {
    jest.spyOn(web3, 'getWeb3ReadOnly').mockImplementationOnce(() => ({
      eth: {
        getFeeHistory: jest.fn(() => {
          return {
            baseFeePerGas: ['not a hex value'],
            gasUsedRatio: [0.39920479014424254],
            oldestBlock: '0x9a9e7a',
            reward: [['0x28ef440e']],
          }
        }),
      },
    }))

    expect(await getFeesPerGas()).toStrictEqual({
      maxFeePerGas: 3.5e9,
      maxPriorityFeePerGas: 2.5e9,
    })
  })
  it('should return maxFeePerGas (baseFeePerGas + maxPriorityFeePerGas)/maxPriorityFeePerGas if getFeeHistory returns a result and it was parsed correctly', async () => {
    jest.spyOn(web3, 'getWeb3ReadOnly').mockImplementationOnce(() => ({
      eth: {
        getFeeHistory: jest.fn(() => {
          return {
            baseFeePerGas: ['0x28ef440e'],
            gasUsedRatio: [0.39920479014424254],
            oldestBlock: '0x9a9e7a',
            reward: [['0x28ef440e']],
          }
        }),
      },
    }))

    expect(await getFeesPerGas()).toStrictEqual({
      maxFeePerGas: 1373538332,
      maxPriorityFeePerGas: 686769166,
    })
  })
})
