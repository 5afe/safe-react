import { getNetworkId, setNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { getGasParam } from '../gas'

describe('Get gas param', () => {
  let initialNetworkId = ETHEREUM_NETWORK.RINKEBY
  beforeAll(() => {
    initialNetworkId = getNetworkId()
  })
  afterAll(() => {
    setNetworkId(initialNetworkId)
  })

  it('should return maxFeePerGas for Mainnet', () => {
    setNetworkId(ETHEREUM_NETWORK.MAINNET)
    expect(getGasParam()).toBe('maxFeePerGas')
  })

  it('should return gasPrice for Arbitrum', () => {
    setNetworkId(ETHEREUM_NETWORK.ARBITRUM)
    expect(getGasParam()).toBe('gasPrice')
  })

  it('should return maxFeePerGas for Rinkeby', () => {
    setNetworkId(ETHEREUM_NETWORK.RINKEBY)
    expect(getGasParam()).toBe('maxFeePerGas')
  })
})
