import UnstoppableResolution from '@unstoppabledomains/resolution'
import { currentRpcServiceUrl } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

let unstoppableResolver

export const getAddressFromUnstoppableDomain = (name: string): Promise<string> => {
  if (!unstoppableResolver) {
    const rpcServiceUrl = currentRpcServiceUrl(store.getState())

    unstoppableResolver = new UnstoppableResolution({
      blockchain: {
        cns: {
          url: rpcServiceUrl,
        },
      },
    })
  }

  return unstoppableResolver.addr(name, 'ETH')
}
