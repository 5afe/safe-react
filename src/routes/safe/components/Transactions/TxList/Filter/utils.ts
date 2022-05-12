import { operations } from '@gnosis.pm/safe-react-gateway-sdk/dist/types/api'
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

type IncomingFilter = operations['incoming_transfers']['parameters']['query']
type OutgoingFilter = operations['multisig_transactions']['parameters']['query']

const getTransactionFilter = ({
  execution_date__gte,
  execution_date__lte,
  to,
  value,
}: FilterForm): Partial<IncomingFilter | OutgoingFilter> => {
  const getISOString = (date: string): string => new Date(date).toISOString()
  return {
    ...(execution_date__gte && { execution_date__gte: getISOString(execution_date__gte) }),
    ...(execution_date__lte && { execution_date__lte: getISOString(execution_date__lte) }),
    ...(to && { to }),
    ...(value && { value: Number(value) }),
  }
}

export const getIncomingFilter = (filter: FilterForm): IncomingFilter => {
  const { token_address } = filter
  return {
    ...getTransactionFilter(filter),
    ...(token_address && { token_address }),
  }
}

export const getMultisigFilter = (filter: FilterForm): OutgoingFilter => {
  const { nonce } = filter
  return {
    ...getTransactionFilter(filter),
    ...(nonce && { nonce: Number(nonce) }),
  }
}

type ModuleFilter = operations['module_transactions']['parameters']['query']

export const getModuleFilter = ({ module }: FilterForm): ModuleFilter => {
  return {
    ...(module && { module }),
  }
}
