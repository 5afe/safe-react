import { formatAmount, formatAmountInUsFormat } from 'src/logic/tokens/utils/formatAmount'


describe('formatAmount', () => {
  it('Given 0 returns 0',  () => {
    // given
    const input = '0'
    const resultExpected = '0'

    // when
    const result = formatAmount(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given 1 returns 1',  () => {
    // given
    const input = '1'
    const resultExpected = '1'

    // when
    const result = formatAmount(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a number between 10000 and 100000 returns a number of format XX,XXX.XXX',  () => {
    // given
    const input = '19797.899'
    const resultExpected = '19,797.899'

    // when
    const result = formatAmount(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given number > 0.001 && < 1000 returns the same number as string',  () => {
    // given
    const input = 999
    const resultExpected = '999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a number between 1000 and 10000 returns a number of format X,XXX',  () => {
    // given
    const input = 9999
    const resultExpected = '9,999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a number between 10000 and 100000 returns a number of format XX,XXX',  () => {
    // given
    const input = 99999
    const resultExpected = '99,999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a number between 100000 and 1000000 returns a number of format XXX,XXX',  () => {
    // given
    const input = 999999
    const resultExpected = '999,999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a number between 10000000 and 100000000 returns a number of format X,XXX,XXX',  () => {
    // given
    const input = 9999999
    const resultExpected = '9,999,999'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(resultExpected)
  })
  it('Given number < 0.001 returns < 0.001',  () => {
    // given
    const input = 0.000001
    const resultExpected = '< 0.001'

    // when
    const result = formatAmount(input.toString())
    // then
    expect(result).toBe(resultExpected)
  })
  it('Given number > 10 ** 15 returns > 1000T',  () => {
    // given
    const input = 10 ** 15 * 2
    const resultExpected = '> 1000T'

    // when
    const result = formatAmount(input.toString())

    // then
    expect(result).toBe(resultExpected)
  })
})

describe('FormatsAmountsInUsFormat', () => {
  it('Given 0 returns 0.00',  () => {
    // given
    const input = 0
    const resultExpected = '0.00'

    // when
    const result = formatAmountInUsFormat(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given 1 returns 1.00',  () => {
    // given
    const input = 1
    const resultExpected = '1.00'

    // when
    const result = formatAmountInUsFormat(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a number in format XXXXX.XXX returns a number of format XX,XXX.XXX',  () => {
    // given
    const input = 19797.899
    const resultExpected = '19,797.899'

    // when
    const result = formatAmountInUsFormat(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a number in format XXXXXXXX.XXX returns a number of format XX,XXX,XXX.XXX',  () => {
    // given
    const input = 19797899.479
    const resultExpected = '19,797,899.479'

    // when
    const result = formatAmountInUsFormat(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given a number in format XXXXXXXXXXX.XXX returns a number of format XX,XXX,XXX,XXX.XXX',  () => {
    // given
    const input = 19797899479.999
    const resultExpected = '19,797,899,479.999'

    // when
    const result = formatAmountInUsFormat(input)

    // then
    expect(result).toBe(resultExpected)
  })
})

