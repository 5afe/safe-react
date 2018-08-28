// @flow
export const upperFirst = (value: string) => value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)

type Value = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'center' | 'end' | 'start' | number | boolean

export const capitalize = (value: Value, prefix?: string) => {
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
