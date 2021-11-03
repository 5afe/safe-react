function getAddressWithoutNetworkPrefix(address = ''): string {
  return address.split(':')[1] || address
}

export default getAddressWithoutNetworkPrefix
