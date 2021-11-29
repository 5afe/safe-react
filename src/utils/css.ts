export const upperFirst = (value: string): string => value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)

export const capitalize = (value: string, prefix?: string): undefined | boolean | string | number => {
  if (!value) {
    return undefined
  }

  if (typeof value === 'boolean') {
    return prefix || ''
  }

  if (typeof value === 'number') {
    return prefix ? `${prefix}${value}` : value
  }

  if (typeof value !== 'string') {
    return false
  }

  const capitalized = upperFirst(value)

  return prefix ? `${prefix}${capitalized}` : capitalized
}
