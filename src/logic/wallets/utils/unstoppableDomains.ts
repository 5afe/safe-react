import UnstoppableResolution from '@unstoppabledomains/resolution'
import { getRpcServiceUrl } from 'src/config'

let unstoppableResolver

export const getAddressFromUnstoppableDomain = (name: string) => {
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
