// @flow
import { BigNumber } from 'bignumber.js'

export function addHexPrefix(hex: string): string {
  if (hex.toLowerCase().substring(0, 2) === '0x') {
    return hex
  }
  return `0x${hex}`
}

export function sanitizeHex(hex: string): string {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex
  if (hex === '') {
    return ''
  }
  hex = hex.length % 2 !== 0 ? `0${hex}` : hex
  return `0x${hex}`
}

export function convertHexToNumber(hex: string): number {
  return BigNumber(hex).toNumber()
}
