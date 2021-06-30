import abiDecoder from 'abi-decoder'
import { getProxyFactoryDeployment } from '@gnosis.pm/safe-deployments'
import { Log } from 'web3-core'
import { checksumAddress } from 'src/utils/checksumAddress'

import { LATEST_SAFE_VERSION } from 'src/utils/constants'

// Init abiDecoder with ProxyCreation ABI
abiDecoder.addABI(
  getProxyFactoryDeployment({
    version: LATEST_SAFE_VERSION,
  })?.abi,
)

export const getNewSafeAddressFromLogs = (logs: Log[]): string => {
  // We find the ProxyCreation event in the logs
  const proxyCreationEvent = abiDecoder.decodeLogs(logs).find(({ name }) => name === 'ProxyCreation')

  // We extract the proxy creation information from the event parameters
  const proxyInformation = proxyCreationEvent?.events?.find(({ name }) => name === 'proxy')

  return checksumAddress(proxyInformation?.value || '')
}
