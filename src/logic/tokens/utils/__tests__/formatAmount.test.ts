import { formatAmount, formatCurrency } from 'src/logic/tokens/utils/formatAmount'

// The test environment defaults Intl.NumberFormat to en-US as Node doesn't ship with every locale
// hence the tests hardcoding en-US formatting but the browser will format correctly
describe('formatAmount', () => {
  it('Given 0 returns 0', () => {
    // given
    const input = '0'
    const expectedResult = '0'

    // when
    const result = formatAmount(input)

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given 1 returns 1', () => {
    // given
    const input = '1'
    const expectedResult = '1'

    // when
    const result = formatAmount(input)

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a string in format XXXXX.XXX returns a number of format XX,XXX.XXX', () => {
    // given
    const input = '19797.899'
    const expectedResult = '19,797.899'

    // when
    const result = formatAmount(input)

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given number > 0.001 && < 1000 returns the same number as string', () => {
    // given
    const input = 999
    const expectedResult = '999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a number between 1000 and 10000 returns a number of format XX,XXX', () => {
    // given
    const input = 9999
    const expectedResult = '9,999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a number between 10000 and 100000 returns a number of format XX,XXX', () => {
    // given
    const input = 99999
    const expectedResult = '99,999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a number between 100000 and 1000000 returns a number of format XXX,XXX', () => {
    // given
    const input = 999999
    const expectedResult = '999,999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a number between 10000000 and 100000000 returns a number of format X,XXX,XXX', () => {
    // given
    const input = 9999999
    const expectedResult = '9,999,999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(expectedResult)
  })
  it('Given number < 0.001 returns < 0.001', () => {
    // given
    const input = 0.000001
    const expectedResult = '< 0.001'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(expectedResult)
  })
  it('Given number > 10 ** 15 returns > 1000T', () => {
    // given
    const input = 10 ** 15 * 2
    const expectedResult = '> 1000T'

    // when
    const result = formatAmount(input.toString())

    // then
    expect(result).toBe(expectedResult)
  })
})

describe('formatCurrency', () => {
  it('Given 0 returns 0.00', () => {
    // given
    const input = 0
    const expectedResult = '0.00 EUR'

    // when
    const result = formatCurrency(input.toString(), 'EUR')

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given 1 returns 1.00', () => {
    // given
    const input = 1
    const expectedResult = '1.00 EUR'

    // when
    const result = formatCurrency(input.toString(), 'EUR')

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a number in format XXXXX.XX returns a number of format XXX,XXX.XX', () => {
    // given
    const input = 311137.3
    const expectedResult = '311,137.30 EUR'

    // when
    const result = formatCurrency(input.toString(), 'EUR')

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a number in format XXXXX.XXX returns a number of format XX,XXX.XXX', () => {
    // given
    const input = 19797.899
    const expectedResult = '19,797.899 EUR'

    // when
    const result = formatCurrency(input.toString(), 'EUR')

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a number in format XXXXXXXX.XXX returns a number of format XX,XXX,XXX.XXX', () => {
    // given
    const input = 19797899.479
    const expectedResult = '19,797,899.479 EUR'

    // when
    const result = formatCurrency(input.toString(), 'EUR')

    // then
    expect(result).toBe(expectedResult)
  })
  it('Given a number in format XXXXXXXXXXX.XXX returns a number of format XX,XXX,XXX,XXX.XXX', () => {
    // given
    const input = 19797899479.999
    const expectedResult = '19,797,899,479.999 EUR'

    // when
    const result = formatCurrency(input.toString(), 'EUR')

    // then
    expect(result).toBe(expectedResult)
  })
  it('Accepts varied currencies', () => {
    expect(formatCurrency('10', 'USD')).toBe('10.00 USD')
    expect(formatCurrency('10', 'GBP')).toBe('10.00 GBP')
  })

  it('Accepts crypto currencies', () => {
    expect(formatCurrency('10', 'xDai')).toBe('10.00 xDai')
    expect(formatCurrency('10', 'GNO')).toBe('10.00 GNO')
  })
})
