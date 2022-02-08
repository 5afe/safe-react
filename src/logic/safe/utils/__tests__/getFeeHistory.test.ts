import { clampMaxPrioFeePerGas, getMaxPriorityFeePerGas } from '../getFeeHistory'

jest.mock('src/logic/wallets/getWeb3', () => {
  const original = jest.requireActual('src/logic/wallets/getWeb3')
  return {
    ...original,
    getWeb3ReadOnly: jest.fn(),
  }
})

describe('clampMaxPrioFeePerGas', () => {
  it('should return the maxPriorityFeePerGas if it is less than maxFeePerGas', () => {
    const maxPriorityFeePerGas = 2
    const maxFeePerGas = 3

    expect(clampMaxPrioFeePerGas(maxPriorityFeePerGas, maxFeePerGas)).toEqual(maxPriorityFeePerGas)
  })

  it('should clamp to 0.001 if the maxPriorityFeePerGas is more than maxFeePerGas and the maxFeePerGas is low', () => {
    const maxPriorityFeePerGas = 1
    const maxFeePerGas = 0.5

    expect(clampMaxPrioFeePerGas(maxPriorityFeePerGas, maxFeePerGas)).toEqual(0.001)
  })
  it('should clamp to maxFeePerGas - 1 if the maxPriorityFeePerGas is more than maxFeePerGas and the maxFeePerGas is > 1', () => {
    const maxFeePerGas = 3
    const maxPriorityFeePerGas = 2

    expect(clampMaxPrioFeePerGas(maxPriorityFeePerGas, maxFeePerGas)).toEqual(2)
  })
})

describe('getFeeHistory', () => {
  const web3 = require('src/logic/wallets/getWeb3')

  const web3Utils = require('web3-utils')
  const originalHexToNumber = web3Utils.hexToNumber

  it('should return the default maxPriorityFeeGas if getFeeHistory threw', async () => {
    web3.getWeb3ReadOnly.mockImplementation(() => ({
      eth: {
        getFeeHistory: jest.fn(() => {
          throw new Error()
        }),
      },
    }))

    expect(await getMaxPriorityFeePerGas()).toEqual(2.5e9)
  })
  it('should return the default maxPriorityFeeGas if hexToNumber threw', async () => {
    web3Utils.hexToNumber = jest.fn().mockImplementation(
      jest.fn(() => {
        throw new Error()
      }),
    )

    expect(await getMaxPriorityFeePerGas()).toEqual(2.5e9)

    web3Utils.hexToNumber = originalHexToNumber
  })
  it('should return the default maxPriorityFeeGas if baseFeePerGas is not a number', async () => {
    web3.getWeb3ReadOnly.mockImplementation(() => ({
      eth: {
        getFeeHistory: jest.fn(() => {
          return {
            baseFeePerGas: ['not a hex value'],
            gasUsedRatio: [0.39920479014424254],
            oldestBlock: '0x9a9e7a',
            reward: [['0x9502f900']],
          }
        }),
      },
    }))

    expect(await getMaxPriorityFeePerGas()).toEqual(2.5e9)
  })
  it('should return the default maxPriorityFeeGas if maxPriorityFeePerGas is not a number', async () => {
    web3.getWeb3ReadOnly.mockImplementation(() => ({
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

    expect(await getMaxPriorityFeePerGas()).toEqual(2.5e9)
  })
  it('should return maxPriorityFeeGas if getFeeHistory returns a result and it was parsed correctly', async () => {
    web3.getWeb3ReadOnly.mockImplementation(() => ({
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

    expect(await getMaxPriorityFeePerGas()).toEqual(686769166)
  })
})
