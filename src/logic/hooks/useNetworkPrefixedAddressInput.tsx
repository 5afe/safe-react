import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { checkNetworkPrefix } from 'src/components/forms/validator'
import { getCurrentShortChainName } from 'src/config'
import { copyToClipboard } from 'src/utils/clipboard'
import { copyShortNameSelector, showShortNameSelector } from '../appearance/selectors'

type PrefixValidationCacheType = {
  address: string
  error: string | undefined
}

type prefixedAddressInputReturnType = {
  networkPrefix: string
  updateNetworkPrefix: (value: any) => void
  showNetworkPrefix: boolean
  networkPrefixError: boolean
  restoreNetworkPrefix: () => void

  networkPrefixValidationWithCache: (value: any) => string | undefined

  onCopyPrefixedAddressField: (e: any) => void
  onPastePrefixedAddressField: (e: any, fieldMutator: (address: string) => void) => void

  getAddressWithoutPrefix: (address: string) => string
}

function useNetworkPrefixedAddressInput(): prefixedAddressInputReturnType {
  const [networkPrefix, setNetworkPrefix] = useState<string>(() => getCurrentShortChainName())
  const networkPrefixError = networkPrefix !== getCurrentShortChainName()

  // from appearance settings
  const showNetworkPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)

  // a cache in needed because the field re-renders with its prefix
  const prefixValidationCache = useRef<PrefixValidationCacheType>({
    address: '',
    error: undefined,
  })

  function restoreNetworkPrefix() {
    setNetworkPrefix(getCurrentShortChainName())
    // and we restore the cache
    prefixValidationCache.current = {
      address: '',
      error: undefined,
    }
  }

  function updateNetworkPrefix(value) {
    const addressSplit = value.split(':')
    const hasPrefixDefined = addressSplit.length > 1
    if (hasPrefixDefined) {
      const newPrefix = addressSplit[0]
      setNetworkPrefix(newPrefix)
    }
  }

  const networkPrefixValidationWithCache = (value) => {
    const addressSplit = value.split(':')
    const hasPrefixDefined = addressSplit.length > 1

    if (hasPrefixDefined) {
      const [, address] = addressSplit

      const validation = checkNetworkPrefix(value)
      // we update the cache
      prefixValidationCache.current = {
        address,
        error: validation,
      }
      return validation
    } else {
      return prefixValidationCache.current.error
    }
  }

  function onCopyPrefixedAddressField(e) {
    e.stopPropagation()
    e.preventDefault()
    const content = e.target.value
    const contentWithPrefix = copyChainPrefix ? `${networkPrefix}:${content}` : content
    copyToClipboard(contentWithPrefix)
  }

  function onPastePrefixedAddressField(e, fieldMutator) {
    e.stopPropagation()
    e.preventDefault()
    const data = e.clipboardData.getData('Text')

    // restore to default when paste
    restoreNetworkPrefix()

    fieldMutator(data)
  }

  function getAddressWithoutPrefix(address: string) {
    return address.split(':')[1] || address
  }

  return {
    networkPrefix,
    updateNetworkPrefix,
    showNetworkPrefix,
    networkPrefixError,
    restoreNetworkPrefix,

    networkPrefixValidationWithCache,

    onCopyPrefixedAddressField,
    onPastePrefixedAddressField,

    getAddressWithoutPrefix,
  }
}

export default useNetworkPrefixedAddressInput
