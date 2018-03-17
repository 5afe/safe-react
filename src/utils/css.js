// @flow
export const upperFirst = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

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

  const capitalized = upperFirst(value)

  return prefix ? `${prefix}${capitalized}` : capitalized
}
