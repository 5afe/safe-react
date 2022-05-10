import { getByteLength } from '../../../utils/getByteLength'

describe('DecodeTxs tests', () => {
  it('should calculate the byte length of a single hex string', () => {
    expect(getByteLength('0x000000ea')).toBe(4)
  })

  it('should calculate the byte length of multiple hex strings', () => {
    expect(getByteLength('0x000000ea,0x48656c6c6f2125')).toBe(11)
  })

  it('should calculate the byte length of an hex array', () => {
    expect(getByteLength(['0x000000ea', '0x48656c6c6f2125'])).toBe(11)
  })

  it('should return 0 if passed a non-hex value', () => {
    expect(getByteLength('hello')).toBe(0)
  })

  it('should return 0 if passed a non-string', () => {
    expect(getByteLength(123 as unknown as string)).toBe(0)
  })
})
