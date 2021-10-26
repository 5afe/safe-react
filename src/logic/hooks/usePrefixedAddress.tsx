import { useSelector } from 'react-redux'

import { copyShortNameSelector, showShortNameSelector } from '../appearance/selectors'
import { extractShortChainName } from 'src/routes/routes'

type PrefixedAddressReturnType = {
  getAddressToDisplay: (address: string) => string
  getAddressToCopy: (address: string) => string
}

export const usePrefixedAddress = (): PrefixedAddressReturnType => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)

  const getAddressToDisplay = (address: string) => `${showChainPrefix ? extractShortChainName() + ':' : ''}${address}`
  const getAddressToCopy = (address: string) => {
    const prefix = copyChainPrefix ? `${extractShortChainName()}:` : ''
    return prefix + address
  }

  return {
    getAddressToDisplay,
    getAddressToCopy,
  }
}
