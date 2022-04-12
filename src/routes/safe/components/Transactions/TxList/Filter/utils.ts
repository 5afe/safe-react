import { TextFieldProps } from '@material-ui/core/TextField/TextField'
import { FieldError } from 'react-hook-form'

import { showShortNameSelector } from 'src/logic/appearance/selectors'
import { store } from 'src/store'
import { isValidAddress, isValidPrefixedAddress } from 'src/utils/isValidAddress'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'
import { textShortener } from 'src/utils/strings'

export const getFormattedAddress = (value: string, shorten = false): string => {
  const { prefix, address } = parsePrefixedAddress(value)
  const formattedAddress = shorten ? textShortener({ charsStart: 8, charsEnd: 6 })(address) : address

  const shouldShowChainPrefix = showShortNameSelector(store.getState())
  return shouldShowChainPrefix ? `${prefix}:${formattedAddress}` : formattedAddress
}

export const formatInputValue = (value: string): string => {
  if (isValidAddress(value) || isValidPrefixedAddress(value)) {
    return getFormattedAddress(value)
  }

  return value
}

export const getFilterHelperText = (value: string, error?: FieldError): TextFieldProps['helperText'] => {
  if (error?.message) {
    return error.message
  }

  if (isValidAddress(value) || isValidPrefixedAddress(value)) {
    return getFormattedAddress(value, true)
  }

  return undefined
}
