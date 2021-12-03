import { _getChainId } from 'src/config'
import { CHAIN_ID } from 'src/config/chain.d'

import { setChainId } from 'src/logic/config/utils'
import { getGasParam } from '../gas'

describe('Get gas param', () => {
  let initialNetworkId = CHAIN_ID.RINKEBY
  beforeAll(() => {
    initialNetworkId = _getChainId()
  })
  afterAll(() => {
    setChainId(initialNetworkId)
  })

  it('should return maxFeePerGas for Mainnet', () => {
    setChainId(CHAIN_ID.ETHEREUM)
    expect(getGasParam()).toBe('maxFeePerGas')
  })

  it('should return gasPrice for Arbitrum', () => {
    setChainId(CHAIN_ID.ARBITRUM)
    expect(getGasParam()).toBe('gasPrice')
  })

  it('should return maxFeePerGas for Rinkeby', () => {
    setChainId(CHAIN_ID.RINKEBY)
    expect(getGasParam()).toBe('maxFeePerGas')
  })
})
