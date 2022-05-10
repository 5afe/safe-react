import UnstoppableResolution from '@unstoppabledomains/resolution'
import { getRpcServiceUrl } from 'src/config'

let unstoppableResolver: UnstoppableResolution

export const getAddressFromUnstoppableDomain = (name: string): Promise<string> => {
  if (!unstoppableResolver) {
    unstoppableResolver = new UnstoppableResolution({
      blockchain: {
        cns: {
          url: getRpcServiceUrl(),
        },
      },
    })
  }

  return unstoppableResolver.addr(name, 'ETH')
}
