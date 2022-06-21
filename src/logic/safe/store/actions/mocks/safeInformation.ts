import { SafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import { CHAIN_ID } from 'src/config/chain.d'

export const remoteSafeInfoWithModules = {
  address: {
    value: '0xe414604Ad49602C0b9c0b08D0781ECF96740786a',
  },
  chainId: '4',
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
    value: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
    name: 'Gnosis Safe: Mastercopy 1.3.0',
    logoUri:
      'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0x3E5c63644E683549055b9Be8653de26E0B4CD36E.png',
  },
  guard: {
    value: '0x4f8a82d73729A33E0165aDeF3450A7F85f007528',
  },
  modules: [
    {
      value: '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134',
    },
  ],
  fallbackHandler: {
    value: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
    name: 'Gnosis Safe: Default Callback Handler 1.3.0',
    logoUri:
      'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4.png',
  },
  version: '1.3.0',
  collectiblesTag: '1634550387',
  txQueuedTag: '1634550387',
  txHistoryTag: '1633430459',
} as unknown as SafeInfo

export const remoteSafeInfoWithoutModules = {
  address: {
    value: '0xe414604Ad49602C0b9c0b08D0781ECF96740786a',
  },
  chainId: '4',
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
    value: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
    name: 'Gnosis Safe: Mastercopy 1.3.0',
    logoUri:
      'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0x3E5c63644E683549055b9Be8653de26E0B4CD36E.png',
  },
  modules: [],
  fallbackHandler: {
    value: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
    name: 'Gnosis Safe: Default Callback Handler 1.3.0',
    logoUri:
      'https://safe-transaction-assets.staging.gnosisdev.com/contracts/logos/0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4.png',
  },
  version: '1.3.0',
  collectiblesTag: '1634550387',
  txQueuedTag: '1634550387',
  txHistoryTag: '1633430459',
} as unknown as SafeInfo

export const localSafesInfo = {
  '0xe414604Ad49602C0b9c0b08D0781ECF96740786a': {
    name: 'Safe A',
    address: '0xe414604Ad49602C0b9c0b08D0781ECF96740786a',
    chainId: CHAIN_ID.RINKEBY,
    threshold: 2,
    owners: [
      '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
      '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
      '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
      '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
      '0x5e47249883F6a1d639b84e8228547fB289e222b6',
    ],
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
    featuresEnabled: ['ERC721', 'SAFE_APPS', 'CONTRACT_INTERACTION'],
    collectiblesTag: '1634550387',
    txQueuedTag: '1634550387',
    txHistoryTag: '1633430459',
  },
}

export const inMemoryPartialSafeInformation = {
  name: 'Safe A',
  address: '0xe414604Ad49602C0b9c0b08D0781ECF96740786a',
  chainId: CHAIN_ID.RINKEBY,
  threshold: 2,
  owners: [
    '0xcCdd7e3af1c24c08D8B65A328351e7e23923d875',
    '0x04Aa5eC2065224aDB15aCE6fb1aAb988Ae55631F',
    '0x52Da808E9a83FEB147a2d0ca7d2f5bBBd3035C47',
    '0x4dcD12D11dE7382F9c26D59Db1aCE1A4737e58A2',
    '0x5e47249883F6a1d639b84e8228547fB289e222b6',
  ],
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
  currentVersion: '1.3.0',
  needsUpdate: false,
  featuresEnabled: ['ERC721', 'SAFE_APPS', 'CONTRACT_INTERACTION', 'SAFE_TX_GAS_OPTIONAL'],
  collectiblesTag: '1634550387',
  txQueuedTag: '1634550387',
  txHistoryTag: '1633430459',
}
