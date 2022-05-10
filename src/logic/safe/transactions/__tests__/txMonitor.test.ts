import { txMonitor } from 'src/logic/safe/transactions/txMonitor'
import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'

// We need to have it defined as const to ensure we return the same instance in mock
const mockWeb3 = {
  eth: {
    getTransaction: jest.fn(() => Promise.reject('getTransaction')) as any,
    getTransactionReceipt: jest.fn(() => Promise.reject('getTransactionReceipt')) as any,
    getBlock: jest.fn(() => Promise.reject('getBlock')) as any,
  },
}

jest.mock('src/logic/wallets/getWeb3', () => ({
  getWeb3ReadOnly: () => mockWeb3,
}))

const params = {
  sender: '0x474e5Ded6b5D078163BFB8F6dBa355C3aA5478C8',
  hash: '0x510bec3129a8dcc57075b67de6292ada338fa05518d18ec81b2cda3cea593a64',
  nonce: 1,
  data: '0',
  gasPrice: '1',
}

const options = {
  delay: 0,
  maxRetries: 10,
}

describe('txMonitor', () => {
  const web3ReadOnly = getWeb3ReadOnly()

  it('should reject when max retries are reached', async () => {
    try {
      await txMonitor(params, options)
      expect(false).toBe('Should not go here')
    } catch (e) {
      expect(e.message).toBe('Code 805: TX monitor error (max retries reached)')
    }
    expect(web3ReadOnly.eth.getTransaction).toHaveBeenCalledTimes(0)
    expect(web3ReadOnly.eth.getTransactionReceipt).toHaveBeenCalledTimes(11)
  })

  it('should load original tx if nonce is undefined', async () => {
    web3ReadOnly.eth.getTransaction = jest.fn(() => Promise.resolve({ nonce: 1, gasPrice: 1 })) as any
    web3ReadOnly.eth.getTransactionReceipt = jest.fn((hash) => Promise.resolve({ hash, status: 'success' })) as any

    await expect(txMonitor({ ...params, nonce: undefined }, options)).resolves.toEqual({
      status: 'success',
      hash: '0x510bec3129a8dcc57075b67de6292ada338fa05518d18ec81b2cda3cea593a64',
    })
    expect(web3ReadOnly.eth.getTransaction).toHaveBeenCalledTimes(1)
    expect(web3ReadOnly.eth.getTransactionReceipt).toHaveBeenCalledTimes(1)
  })

  it('should fail if it cannot load the original tx receipt', async () => {
    web3ReadOnly.eth.getTransaction = jest.fn(() => Promise.resolve({ nonce: 1, gasPrice: 1 })) as any
    web3ReadOnly.eth.getTransactionReceipt = jest.fn(() => Promise.reject('No receipt'))

    try {
      await txMonitor(params, options)
      expect(false).toBe('Should not go here')
    } catch (e) {
      expect(e.message).toBe('Code 805: TX monitor error (max retries reached)')
    }

    expect(web3ReadOnly.eth.getTransaction).toHaveBeenCalledTimes(0)
    expect(web3ReadOnly.eth.getTransactionReceipt).toHaveBeenCalledTimes(11)
  })

  it('should return speed-up tx receipt', async () => {
    web3ReadOnly.eth.getBlock = jest.fn(() =>
      Promise.resolve({
        transactions: [
          {
            hash: '0xSPEEDY',
            from: params.sender,
            nonce: params.nonce,
            input: params.data,
          },
        ],
      }),
    ) as any

    web3ReadOnly.eth.getTransactionReceipt = jest.fn((hash) => {
      return hash === '0xSPEEDY'
        ? Promise.resolve({ hash, status: 'success' } as any)
        : Promise.reject('No original receipt')
    })

    await expect(txMonitor(params, options)).resolves.toEqual({
      status: 'success',
      hash: '0xSPEEDY',
    })
    expect(web3ReadOnly.eth.getBlock).toHaveBeenCalledTimes(1)
    expect(web3ReadOnly.eth.getTransactionReceipt).toHaveBeenCalledTimes(2)
  })

  it('should fail if it cannot find a speed-up tx', async () => {
    web3ReadOnly.eth.getBlock = jest.fn(() =>
      Promise.resolve({
        transactions: [
          {
            hash: '0x123',
            from: 'Someone',
            nonce: 12,
            input: '123',
          },
        ],
      }),
    ) as any

    web3ReadOnly.eth.getTransactionReceipt = jest.fn(() => Promise.reject('No original receipt'))

    try {
      await txMonitor(params, options)
      expect(false).toBe('Should not go here')
    } catch (e) {
      expect(e.message).toBe('Code 805: TX monitor error (max retries reached)')
    }

    expect(web3ReadOnly.eth.getBlock).toHaveBeenCalledTimes(11)
    expect(web3ReadOnly.eth.getTransactionReceipt).toHaveBeenCalledTimes(11)
  })
})
