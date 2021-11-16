function getNetworkPrefix(address = ''): string {
  const splitAddress = address.split(':')
  const [prefix] = splitAddress
  const hasPrefixDefined = splitAddress.length > 1
  return hasPrefixDefined ? prefix : ''
}

export default getNetworkPrefix
