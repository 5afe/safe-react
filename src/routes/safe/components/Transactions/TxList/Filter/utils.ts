import { operations } from '@gnosis.pm/safe-react-gateway-sdk/dist/types/api'
import { TextFieldProps } from '@material-ui/core/TextField/TextField'
import { ParsedUrlQuery } from 'querystring'
import { FieldError } from 'react-hook-form'

import { showShortNameSelector } from 'src/logic/appearance/selectors'
import { store } from 'src/store'
import { isValidAddress, isValidPrefixedAddress } from 'src/utils/isValidAddress'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'
import { textShortener } from 'src/utils/strings'
import { toWei } from 'web3-utils'
import {
  AMOUNT_FIELD_NAME,
  DATE_FROM_FIELD_NAME,
  DATE_TO_FIELD_NAME,
  FilterForm,
  FilterType,
  FILTER_TYPE_FIELD_NAME,
  MODULE_FIELD_NAME,
  NONCE_FIELD_NAME,
  RECIPIENT_FIELD_NAME,
  TOKEN_ADDRESS_FIELD_NAME,
} from '.'

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

// Filter helper

export const isTxFilter = (object: ParsedUrlQuery): object is Partial<FilterForm> => {
  const FILTER_FIELD_NAMES = [
    FILTER_TYPE_FIELD_NAME,
    DATE_FROM_FIELD_NAME,
    DATE_TO_FIELD_NAME,
    RECIPIENT_FIELD_NAME,
    AMOUNT_FIELD_NAME,
    TOKEN_ADDRESS_FIELD_NAME,
    MODULE_FIELD_NAME,
    NONCE_FIELD_NAME,
  ]
  return Object.keys(object).some((key) => FILTER_FIELD_NAMES.includes(key))
}

// Filter formatters

type IncomingFilter = operations['incoming_transfers']['parameters']['query']
type OutgoingFilter = operations['multisig_transactions']['parameters']['query']
type Filter = (FilterForm | Partial<FilterForm>) & { type?: FilterType }

const getTransactionFilter = ({
  execution_date__gte,
  execution_date__lte,
  value,
}: Filter): Partial<IncomingFilter | OutgoingFilter> => {
  const getISOString = (date: string): string => new Date(date).toISOString()
  return {
    ...(execution_date__gte && { execution_date__gte: getISOString(execution_date__gte) }),
    ...(execution_date__lte && { execution_date__lte: getISOString(execution_date__lte) }),
    ...(value && { value: toWei(value) }),
  }
}

export const getIncomingFilter = (filter: Filter): IncomingFilter => {
  const { token_address } = filter
  return {
    ...getTransactionFilter(filter),
    ...(token_address && { token_address }),
  }
}

export const getMultisigFilter = (filter: Filter, executed = false): OutgoingFilter => {
  const { to, nonce } = filter
  return {
    ...getTransactionFilter(filter),
    ...(to && { to }),
    ...(nonce && { nonce }),
    ...(executed && { executed: `${executed}` }),
  }
}

type ModuleFilter = operations['module_transactions']['parameters']['query']

export const getModuleFilter = ({ to, module }: Filter): ModuleFilter => {
  return {
    ...(to && { to }),
    ...(module && { module }),
  }
}
