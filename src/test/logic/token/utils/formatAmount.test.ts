import { formatAmountInUsFormat } from '../../../../logic/tokens/utils/formatAmount'


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
  it('Given 19797.899 returns 19,797.899',  () => {
    // given
    const input = 19797.899
    const resultExpected = '19,797.899'

    // when
    const result = formatAmountInUsFormat(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given 19797899.479 returns 19,797,899.479',  () => {
    // given
    const input = 19797899.479
    const resultExpected = '19,797,899.479'

    // when
    const result = formatAmountInUsFormat(input)

    // then
    expect(result).toBe(resultExpected)
  })
  it('Given 19797899479.999 returns 19,797,899,479.999',  () => {
    // given
    const input = 19797899479.999
    const resultExpected = '19,797,899,479.999'

    // when
    const result = formatAmountInUsFormat(input)

    // then
    expect(result).toBe(resultExpected)
  })
})