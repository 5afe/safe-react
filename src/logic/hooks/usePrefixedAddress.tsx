import { useSelector } from 'react-redux'

import { copyShortNameSelector, showShortNameSelector } from '../appearance/selectors'
import { extractShortChainName } from 'src/routes/routes'

type PrefixedAddressReturnType = {
  getAddressToDisplay: (address: string) => string
  getAddressToCopy: (address: string, customPrefix?: string) => string
  getAddressWithoutPrefix: (address: string) => string
}

export const usePrefixedAddress = (): PrefixedAddressReturnType => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)

  // address

  const getAddressToDisplay = (address: string) => `${showChainPrefix ? extractShortChainName() + ':' : ''}${address}`
  const getAddressToCopy = (address: string, customPrefix = extractShortChainName()) => {
    const prefix = copyChainPrefix ? `${customPrefix}:` : ''
    return prefix + address
  }

  const getAddressWithoutPrefix = (address: string) => address.split(':')[1] || address

  return {
    getAddressToDisplay,
    getAddressToCopy,
    getAddressWithoutPrefix,
  }
}
