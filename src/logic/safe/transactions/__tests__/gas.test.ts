import { _getChainId } from 'src/config'
import { CHAIN_ID } from 'src/config/chain.d'

import { setChainId } from 'src/logic/config/utils'
import { isMaxFeeParam } from '../gas'

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
    expect(isMaxFeeParam()).toBeTruthy()
  })

  it('should return gasPrice for Arbitrum', () => {
    setChainId(CHAIN_ID.ARBITRUM)
    expect(isMaxFeeParam()).toBeFalsy()
  })

  it('should return maxFeePerGas for Rinkeby', () => {
    setChainId(CHAIN_ID.RINKEBY)
    expect(isMaxFeeParam()).toBeTruthy()
  })
})
