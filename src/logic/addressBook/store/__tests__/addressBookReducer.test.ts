import { CHAIN_ID } from 'src/config/chain.d'
import { addressBookFixEmptyNames } from '../actions'
import addressBookReducer, { batchLoadEntries } from '../reducer'

describe('Test AddressBook BatchLoadEntries Reducer', () => {
  describe('batchLoadEntries', () => {
    it('returns an addressbook array', () => {
      const addressBookEntries = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: 'Entry 1',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: 'Entry 2',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const currentState = []
      const action = {
        type: 'addressBook/import',
        payload: addressBookEntries,
      }
      const newState = batchLoadEntries(currentState, action)
      expect(newState).toStrictEqual(addressBookEntries)
    })

    it('merges entries from different chains', () => {
      const addressBookEntries = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: 'Entry 1',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: 'Entry 2',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const initialState = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: 'Entry 1',
          chainId: CHAIN_ID.VOLTA,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: 'Entry 2',
          chainId: CHAIN_ID.VOLTA,
        },
      ]
      const action = {
        type: 'addressBook/import',
        payload: addressBookEntries,
      }
      const newState = batchLoadEntries(initialState, action)
      expect(newState).toStrictEqual(initialState.concat(addressBookEntries))
    })

    it('skips entries with wrong name format', () => {
      const addressBookEntries = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: 'OWNER # 1',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: 'OWNER # 2',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const initialState = []
      const action = {
        type: 'addressBook/import',
        payload: addressBookEntries,
      }
      const newState = batchLoadEntries(initialState, action)
      expect(newState).toStrictEqual(initialState)
    })

    it('skips entries with invalid addresses', () => {
      const warnSpy = jest.spyOn(console, 'warn')

      const addressBookEntries = [
        {
          address: 'invalid',
          name: 'NewEntry 1',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: 'NewEntry 2',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const initialState = []
      const action = {
        type: 'addressBook/import',
        payload: addressBookEntries,
      }
      const newState = batchLoadEntries(initialState, action)
      expect(warnSpy).toHaveBeenCalledWith(
        'We are unable to import the entry for NewEntry 1 (invalid) as it is invalid.',
      )
      expect(newState).toStrictEqual([addressBookEntries[1]])
    })

    it('replaces name when entries share address and chain', () => {
      const addressBookEntries = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: 'NewEntry 1',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: 'New Entry 2',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const initialState = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: 'Entry 1',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: 'Entry 2',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const action = {
        type: 'addressBook/import',
        payload: addressBookEntries,
      }
      const newState = batchLoadEntries(initialState, action)
      expect(newState).toStrictEqual(addressBookEntries)
    })

    it('fixes empty names upon import', () => {
      const payloadAddressBookEntries = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: '',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: '',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const addressBookEntries = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: '0x5fb5...0A00',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: '0xF5A2...e88f',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const initialState = []
      const action = {
        type: 'addressBook/import',
        payload: payloadAddressBookEntries,
      }
      const newState = batchLoadEntries(initialState, action)
      expect(newState).toStrictEqual(addressBookEntries)
    })

    it('checksums addresses upon import', () => {
      const payloadAddressBookEntries = [
        {
          address: '0x4462527986c3fd47f498ef25b4d01e6aad7abcb2',
          name: 'Entry 1',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0x918925e548c7208713a965a8cda0287e5ff9d96f',
          name: 'Entry 2',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const addressBookEntries = [
        {
          address: '0x4462527986c3FD47F498Ef25b4d01e6aad7AbcB2',
          name: 'Entry 1',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0x918925e548c7208713a965a8CDA0287e5fF9D96F',
          name: 'Entry 2',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]
      const initialState = []
      const action = {
        type: 'addressBook/import',
        payload: payloadAddressBookEntries,
      }
      const newState = batchLoadEntries(initialState, action)
      expect(newState).toStrictEqual(addressBookEntries)
    })
  })

  describe('addressBookFixEmptyNames', () => {
    it('fixes empty names', () => {
      const prevState = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: '',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: '',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]

      expect(addressBookReducer(prevState, addressBookFixEmptyNames())).toEqual([
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: '0x5fb5...0A00',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: '0xF5A2...e88f',
          chainId: CHAIN_ID.RINKEBY,
        },
      ])
    })

    it("doesn't 'fix' named contacts", () => {
      const prevState = [
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: 'test',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: '',
          chainId: CHAIN_ID.RINKEBY,
        },
      ]

      expect(addressBookReducer(prevState, addressBookFixEmptyNames())).toEqual([
        {
          address: '0x5fb582FD320ab1CBf055F65ED74D01b9DdB90A00',
          name: 'test',
          chainId: CHAIN_ID.RINKEBY,
        },
        {
          address: '0xF5A2915982BC8b0dEDda9cEF79297A83081Fe88f',
          name: '0xF5A2...e88f',
          chainId: CHAIN_ID.RINKEBY,
        },
      ])
    })
  })
})
