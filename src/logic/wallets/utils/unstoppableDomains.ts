import UnstoppableResolution from '@unstoppabledomains/resolution'
import { getRpcServiceUrl } from 'src/config'

let UDResolution: UnstoppableResolution

export const getAddressFromUnstoppableDomain = (name: string): Promise<string> => {
  if (!UDResolution) {
    UDResolution = new UnstoppableResolution({
      sourceConfig: {
        uns: {
          api: true,
          url: getRpcServiceUrl(),
        },
      },
    })
  }
  return UDResolution.addr(name, 'ETH')
}
