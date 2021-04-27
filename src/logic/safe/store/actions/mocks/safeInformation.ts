import { List } from 'immutable'
import { makeOwner } from '../../models/owner'

export const remoteSafeInfoWithModules = {
  address: {
    value: '0xe414604Ad49602C0b9c0b08D0781ECF96740786a',
  },
  nonce: 492,
  threshold: 2,
  owners: [
    {
      value: '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
    },
    {
      value: '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
    },
    {
      value: '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
    },
    {
      value: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
    },
    {
      value: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
    },
  ],
  implementation: {
    value: '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F',
    name: 'Gnosis Safe: Mastercopy 1.1.1',
    logoUrl:
      'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F.png',
  },
  modules: [
    {
      value: '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134',
    },
  ],
  fallbackHandler: {
    value: '0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44',
    name: 'Gnosis Safe: Default Callback Handler 1.1.1',
    logoUrl:
      'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44.png',
  },
  version: '1.1.1',
}
export const remoteSafeInfoWithoutModules = {
  address: {
    value: '0xe414604Ad49602C0b9c0b08D0781ECF96740786a',
  },
  nonce: 492,
  threshold: 2,
  owners: [
    {
      value: '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
    },
    {
      value: '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
    },
    {
      value: '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
    },
    {
      value: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
    },
    {
      value: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
    },
  ],
  implementation: {
    value: '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F',
    name: 'Gnosis Safe: Mastercopy 1.1.1',
    logoUrl:
      'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F.png',
  },
  modules: [],
  fallbackHandler: {
    value: '0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44',
    name: 'Gnosis Safe: Default Callback Handler 1.1.1',
    logoUrl:
      'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44.png',
  },
  version: '1.1.1',
}
export const localSafesInfo = {
  '0xe414604Ad49602C0b9c0b08D0781ECF96740786a': {
    name: 'Safe A',
    address: '0xe414604Ad49602C0b9c0b08D0781ECF96740786a',
    threshold: 2,
    owners: List(
      [
        {
          name: 'UNKNOWN',
          address: '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
        },
        {
          name: 'UNKNOWN',
          address: '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
        },
        {
          name: 'UNKNOWN',
          address: '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
        },
        {
          name: 'Owner B',
          address: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
        },
        {
          name: 'Owner A',
          address: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
        },
      ].map(makeOwner),
    ),
    modules: [['0x0000000000000000000000000000000000000001', '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134']],
    spendingLimits: [
      {
        delegate: '0xbD326ba3D9BaD3A08cf521C41bC69A620a750B3f',
        token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        amount: '900000000000000000000',
        spent: '0',
        resetTimeMin: '1440',
        lastResetMin: '26986494',
        nonce: '1',
      },
      {
        delegate: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
        token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        amount: '1000000000000000000',
        spent: '1000000000000000000',
        resetTimeMin: '0',
        lastResetMin: '26783877',
        nonce: '6',
      },
      {
        delegate: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
        token: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
        amount: '1000000000000000000',
        spent: '0',
        resetTimeMin: '0',
        lastResetMin: '26783946',
        nonce: '1',
      },
      {
        delegate: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
        token: '0x0000000000000000000000000000000000000000',
        amount: '9000000000000000000',
        spent: '0',
        resetTimeMin: '1440',
        lastResetMin: '26986496',
        nonce: '2',
      },
      {
        delegate: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
        token: '0xFab46E002BbF0b4509813474841E0716E6730136',
        amount: '20000000000000000000',
        spent: '0',
        resetTimeMin: '1440',
        lastResetMin: '26986500',
        nonce: '2',
      },
      {
        delegate: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
        token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        amount: '1000000000000000000',
        spent: '1000000000000000000',
        resetTimeMin: '0',
        lastResetMin: '26770543',
        nonce: '2',
      },
    ],
    nonce: 492,
    currentVersion: '1.1.1',
    needsUpdate: false,
    featuresEnabled: ['ERC721', 'ERC1155', 'SAFE_APPS', 'CONTRACT_INTERACTION'],
  },
}
export const inMemoryPartialSafeInformation = {
  name: 'Safe A',
  address: '0xe414604Ad49602C0b9c0b08D0781ECF96740786a',
  threshold: 2,
  owners: List(
    [
      {
        name: 'UNKNOWN',
        address: '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
      },
      {
        name: 'UNKNOWN',
        address: '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
      },
      {
        name: 'UNKNOWN',
        address: '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
      },
      {
        name: 'Owner B',
        address: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
      },
      {
        name: 'Owner A',
        address: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
      },
    ].map(makeOwner),
  ),
  modules: [['0x0000000000000000000000000000000000000001', '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134']],
  spendingLimits: [
    {
      delegate: '0xbD326ba3D9BaD3A08cf521C41bC69A620a750B3f',
      token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      amount: '900000000000000000000',
      spent: '0',
      resetTimeMin: '1440',
      lastResetMin: '26986494',
      nonce: '1',
    },
    {
      delegate: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
      token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      amount: '1000000000000000000',
      spent: '1000000000000000000',
      resetTimeMin: '0',
      lastResetMin: '26783877',
      nonce: '6',
    },
    {
      delegate: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
      token: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
      amount: '1000000000000000000',
      spent: '0',
      resetTimeMin: '0',
      lastResetMin: '26783946',
      nonce: '1',
    },
    {
      delegate: '0x5e47249883F6a1d639b84e8228547fB289e222b6',
      token: '0x0000000000000000000000000000000000000000',
      amount: '9000000000000000000',
      spent: '0',
      resetTimeMin: '1440',
      lastResetMin: '26986496',
      nonce: '2',
    },
    {
      delegate: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
      token: '0xFab46E002BbF0b4509813474841E0716E6730136',
      amount: '20000000000000000000',
      spent: '0',
      resetTimeMin: '1440',
      lastResetMin: '26986500',
      nonce: '2',
    },
    {
      delegate: '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
      token: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      amount: '1000000000000000000',
      spent: '1000000000000000000',
      resetTimeMin: '0',
      lastResetMin: '26770543',
      nonce: '2',
    },
  ],
  nonce: 492,
  currentVersion: '1.1.1',
  needsUpdate: false,
  featuresEnabled: ['ERC721', 'ERC1155', 'SAFE_APPS', 'CONTRACT_INTERACTION'],
}
