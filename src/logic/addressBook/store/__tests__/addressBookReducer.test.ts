import { CHAIN_ID } from 'src/config/chain.d'
import { batchLoadEntries } from '../reducer'

describe('Test AddressBook BatchLoadEntries Reducer', () => {
  it('returns an addressbook array', () => {
    const addressBookEntries = [
      {
        address: '0x4462527986c3fD47f498eF25B4D01e6AAD7aBcb2',
        name: 'Entry 1',
        chainId: CHAIN_ID.RINKEBY,
      },
      {
        address: '0x918925e548C7208713a965A8cdA0287e5FF9d96F',
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
        address: '0x4462527986c3fD47f498eF25B4D01e6AAD7aBcb2',
        name: 'Entry 1',
        chainId: CHAIN_ID.RINKEBY,
      },
      {
        address: '0x918925e548C7208713a965A8cdA0287e5FF9d96F',
        name: 'Entry 2',
        chainId: CHAIN_ID.RINKEBY,
      },
    ]
    const initialState = [
      {
        address: '0x4462527986c3fD47f498eF25B4D01e6AAD7aBcb2',
        name: 'Entry 1',
        chainId: CHAIN_ID.BSC,
      },
      {
        address: '0x918925e548C7208713a965A8cdA0287e5FF9d96F',
        name: 'Entry 2',
        chainId: CHAIN_ID.BSC,
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
        address: '0x4462527986c3fD47f498eF25B4D01e6AAD7aBcb2',
        name: 'OWNER # 1',
        chainId: CHAIN_ID.RINKEBY,
      },
      {
        address: '0x918925e548C7208713a965A8cdA0287e5FF9d96F',
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

  it('replaces name when entries share address and chain', () => {
    const addressBookEntries = [
      {
        address: '0x4462527986c3fD47f498eF25B4D01e6AAD7aBcb2',
        name: 'NewEntry 1',
        chainId: CHAIN_ID.RINKEBY,
      },
      {
        address: '0x918925e548C7208713a965A8cdA0287e5FF9d96F',
        name: 'New Entry 2',
        chainId: CHAIN_ID.RINKEBY,
      },
    ]
    const initialState = [
      {
        address: '0x4462527986c3fD47f498eF25B4D01e6AAD7aBcb2',
        name: 'Entry 1',
        chainId: CHAIN_ID.RINKEBY,
      },
      {
        address: '0x918925e548C7208713a965A8cdA0287e5FF9d96F',
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
})
