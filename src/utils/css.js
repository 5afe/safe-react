// @flow
export const capitalize = (value: string, prefix?: string) => {
  if (!value) {
    return undefined
  }

  if (typeof value === 'boolean') {
    return prefix || ''
  }

  if (typeof value === 'number') {
    return `${prefix}${value}`
  }

  if (typeof value !== 'string') {
    return false
  }

  const capitalized = value.charAt(0).toUpperCase() + value.slice(1)

  return prefix ? `${prefix}${capitalized}` : capitalized
}
