import { FilterForm } from '.'

export const isValidAmount = (value: FilterForm['value']): string | undefined => {
  if (value && isNaN(Number(value))) {
    return 'Invalid number'
  }
}

export const isValidNonce = (value: FilterForm['nonce']): string | undefined => {
  if (value.length === 0) {
    return
  }

  const number = Number(value)
  if (isNaN(number)) {
    return 'Invalid number'
  }
  if (number < 0) {
    return 'Nonce cannot be negative'
  }
}
