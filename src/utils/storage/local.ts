const PREFIX = 'SAFE__'

const prefixKey = (key: string): string => `${PREFIX}${key}`

export const getItem = <T>(key: string): T | undefined => {
  const saved = localStorage.getItem(prefixKey(key))
  let data = undefined
  if (saved) {
    try {
      data = JSON.parse(saved)
    } catch (e) {
      data = undefined
    }
  }
  return data as unknown as T | undefined
}

export const setItem = <T>(key: string, item: T): void => {
  localStorage.setItem(prefixKey(key), JSON.stringify(item))
}
