import * as gatewaySDK from '@gnosis.pm/safe-react-gateway-sdk'
import { FilterType } from 'src/routes/safe/components/Transactions/TxList/Filter'
import { _getHistoryPageUrl, _getTxHistory } from '../fetchTransactions/loadGatewayTransactions'

jest.mock('@gnosis.pm/safe-react-gateway-sdk', () => {
  const original = jest.requireActual('@gnosis.pm/safe-react-gateway-sdk')
  return {
    ...original,
    getIncomingTransfers: jest.fn,
    getMultisigTransactions: jest.fn,
    getModuleTransactions: jest.fn,
    getTransactionHistory: jest.fn,
  }
})

describe('loadGatewayTransactions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getTxHistory', () => {
    it('fetches incoming transfers according to type', async () => {
      const spy = jest.spyOn(gatewaySDK, 'getIncomingTransfers')

      await _getTxHistory('4', '0x123', { type: FilterType.INCOMING, token_address: '0x456' })

      expect(spy).toHaveBeenCalledWith('4', '0x123', { token_address: '0x456' }, undefined)
    })

    it('fetches multisig transfers according to type', async () => {
      const spy = jest.spyOn(gatewaySDK, 'getMultisigTransactions')

      await _getTxHistory('4', '0x123', { type: FilterType.MULTISIG, to: '0x456' })

      expect(spy).toHaveBeenCalledWith('4', '0x123', { to: '0x456', executed: 'true' }, undefined)
    })

    it('fetches module transfers according to type', async () => {
      const spy = jest.spyOn(gatewaySDK, 'getModuleTransactions')

      await _getTxHistory('4', '0x123', { type: FilterType.MODULE, to: '0x456' })

      expect(spy).toHaveBeenCalledWith('4', '0x123', { to: '0x456' }, undefined)
    })

    it('fetches historical transfers by default', async () => {
      const spy = jest.spyOn(gatewaySDK, 'getTransactionHistory')

      await _getTxHistory('4', '0x123')

      expect(spy).toHaveBeenCalledWith('4', '0x123', undefined)
    })
  })

  describe('getHistoryPageUrl', () => {
    it('returns the pageUrl when a falsy pageUrl is provided', () => {
      // SDK types should allow for `null` in TransactionListPage['next' | 'previous'] as it's returned by gateway
      expect(_getHistoryPageUrl(null as unknown as undefined, { type: FilterType.INCOMING })).toBe(null)
    })

    it('returns the pageUrl when a no filter is provided', () => {
      expect(_getHistoryPageUrl('http://test123.com', undefined)).toBe('http://test123.com')
      expect(_getHistoryPageUrl('http://test456.com', {})).toBe('http://test456.com')
    })

    it('returns the pageUrl if it is an invalid URL', () => {
      expect(_getHistoryPageUrl('test123', { type: FilterType.INCOMING })).toBe('test123')
    })

    it('appends only defined filter values to the pageUrl', () => {
      expect(_getHistoryPageUrl('http://test123.com', { type: FilterType.INCOMING, value: undefined })).toBe(
        'http://test123.com/?type=Incoming',
      )
      expect(
        _getHistoryPageUrl('http://test456.com', { type: FilterType.MULTISIG, execution_date__gte: undefined }),
      ).toBe('http://test456.com/?type=Outgoing')
    })
  })
})
