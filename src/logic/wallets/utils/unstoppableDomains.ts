import UnstoppableResolution from '@unstoppabledomains/resolution'

let UDResolution: UnstoppableResolution

export const getAddressFromUnstoppableDomain = (name: string): Promise<string> => {
  if (!UDResolution) {
    UDResolution = new UnstoppableResolution({
      sourceConfig: {
        uns: {
          api: true,
        },
      },
    })
  }
  const resolved = UDResolution.addr(name, 'ETH')
  return resolved
}
