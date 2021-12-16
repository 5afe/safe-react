import { setChainId } from 'src/logic/config/utils'
import { CHAIN_ID } from '../chain.d'
import { getPublicRpcUrl } from '..'

describe('Config getters', () => {
  describe('getPublicRpcUrl', () => {
    afterEach(() => {
      setChainId(CHAIN_ID.RINKEBY)
    })

    it('gets a public RPC from the config', () => {
      setChainId(CHAIN_ID.POLYGON)
      expect(getPublicRpcUrl()).toBe('https://polygon-rpc.com/')
    })
  })
})
