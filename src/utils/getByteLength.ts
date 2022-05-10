import { hexToBytes } from 'web3-utils'

export const getByteLength = (data: string | string[]): number => {
  try {
    if (!Array.isArray(data)) {
      data = data.split(',')
    }
    // Return the sum of the byte sizes of each hex string
    return data.reduce((result, hex) => {
      const bytes = hexToBytes(hex)
      return result + bytes.length
    }, 0)
  } catch (err) {
    return 0
  }
}
