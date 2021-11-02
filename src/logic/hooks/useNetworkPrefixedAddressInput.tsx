import { useState, useEffect, useRef, SyntheticEvent, ClipboardEvent, Dispatch, SetStateAction } from 'react'
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
  updateNetworkPrefix: (value: string) => void
  showNetworkPrefix: boolean
  restoreNetworkPrefix: () => void

  networkPrefixError: boolean

  valueWithPrefix: string
  setValueWithPrefix: Dispatch<SetStateAction<string>>

  networkPrefixValidationWithCache: (value: any) => string | undefined

  onCopyPrefixedAddressField: (e: ClipboardEvent<HTMLInputElement>) => void
  onPastePrefixedAddressField: (
    e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldMutator: (address: string) => void,
  ) => void

  getAddressWithoutPrefix: (address: string) => string
}

function useNetworkPrefixedAddressInput(currentValue: string): prefixedAddressInputReturnType {
  // from appearance settings
  const showNetworkPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)

  const [networkPrefix, setNetworkPrefix] = useState<string>(() => getCurrentShortChainName())
  const [valueWithPrefix, setValueWithPrefix] = useState<string>('')

  useEffect(() => {
    const address = getAddressWithoutPrefix(currentValue)
    const value = getAddressWithoutPrefix(valueWithPrefix)

    if (address !== value) {
      restoreNetworkPrefix()
      setValueWithPrefix(currentValue)
    }
  }, [currentValue, valueWithPrefix])

  const networkPrefixError = networkPrefix !== getCurrentShortChainName()

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

  function updateNetworkPrefix(value: string) {
    const addressSplit = value.split(':')
    const hasPrefixDefined = addressSplit.length > 1
    if (hasPrefixDefined) {
      const newPrefix = addressSplit[0]
      setNetworkPrefix(newPrefix)
    }

    if (!value) {
      restoreNetworkPrefix()
    }
  }

  const networkPrefixValidationWithCache = (value: string) => {
    const addressSplit = value.split(':')
    const hasPrefixDefined = addressSplit.length > 1

    const hasChangeValue =
      getAddressWithoutPrefix(value) !== getAddressWithoutPrefix(prefixValidationCache.current.address)

    if (hasPrefixDefined || !value || hasChangeValue) {
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

  function onCopyPrefixedAddressField(e: SyntheticEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement
    const content = target.value
    const contentWithPrefix = copyChainPrefix ? `${networkPrefix}:${getAddressWithoutPrefix(content)}` : content
    copyToClipboard(contentWithPrefix)
  }

  function onPastePrefixedAddressField(e: ClipboardEvent<HTMLInputElement>, fieldMutator: (address: string) => void) {
    e.stopPropagation()
    e.preventDefault()
    const data = e.clipboardData.getData('Text')

    // restore to default when paste
    restoreNetworkPrefix()

    fieldMutator(data)
    setValueWithPrefix(data)
  }

  function getAddressWithoutPrefix(address = '') {
    return address.split(':')[1] || address
  }

  return {
    networkPrefix,
    updateNetworkPrefix,
    showNetworkPrefix,
    restoreNetworkPrefix,

    networkPrefixError,

    valueWithPrefix,
    setValueWithPrefix,

    networkPrefixValidationWithCache,

    onCopyPrefixedAddressField,
    onPastePrefixedAddressField,

    getAddressWithoutPrefix,
  }
}

export default useNetworkPrefixedAddressInput
