function getNetworkPrefix(address = ''): string {
  const splittedAddress = address.split(':')
  const [prefix] = splittedAddress
  const hasPrefixDefined = splittedAddress.length > 1
  return hasPrefixDefined ? prefix : ''
}

export default getNetworkPrefix
