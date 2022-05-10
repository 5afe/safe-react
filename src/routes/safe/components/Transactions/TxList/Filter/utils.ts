import { TextFieldProps } from '@material-ui/core/TextField/TextField'
import { FieldError } from 'react-hook-form'

import { showShortNameSelector } from 'src/logic/appearance/selectors'
import { store } from 'src/store'
import { isValidAddress, isValidPrefixedAddress } from 'src/utils/isValidAddress'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'
import { textShortener } from 'src/utils/strings'
import { FilterForm } from '.'

// Value formatters

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

// Helper text formatter

export const getFilterHelperText = (value: string, error?: FieldError): TextFieldProps['helperText'] => {
  if (error?.message) {
    return error.message
  }

  if (isValidAddress(value) || isValidPrefixedAddress(value)) {
    return getFormattedAddress(value, true)
  }

  return undefined
}

// Filter formatters

const getTransactionFilter = ({
  execution_date__gte,
  execution_date__lte,
  to,
  value,
}: FilterForm): Record<string, string> => {
  const getTimestampString = (date: string): string => new Date(date).getTime().toString()
  return {
    ...(execution_date__gte && { execution_date__gte: getTimestampString(execution_date__gte) }),
    ...(execution_date__lte && { execution_date__lte: getTimestampString(execution_date__lte) }),
    ...(to && { to }),
    ...(value && { value }),
  }
}

export const getIncomingFilter = (filter: FilterForm): Record<string, string> => {
  const { token_address, type } = filter
  return {
    type,
    ...getTransactionFilter(filter),
    ...(token_address && { token_address }),
  }
}

export const getOutgoingFilter = (filter: FilterForm): Record<string, string> => {
  const { nonce, type } = filter
  return {
    type,
    ...getTransactionFilter(filter),
    ...(nonce && { nonce }),
  }
}

export const getModuleFilter = ({ module, type }: FilterForm): Record<string, string> => {
  return {
    type,
    ...(module && { module }),
  }
}
