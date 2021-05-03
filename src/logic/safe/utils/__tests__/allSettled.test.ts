import { allSettled } from 'src/logic/safe/utils/allSettled'

describe('allSettled', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it(`should return null for the failed promises`, async () => {
    // Given
    const promises = [
      Promise.resolve('success'),
      Promise.resolve('success'),
      Promise.reject('failed!'),
      Promise.resolve('success'),
    ]

    // When
    const results = await allSettled(...promises)

    // Then
    expect(results).toStrictEqual(['success', 'success', null, 'success'])
  })

  it(`should work for one single successful promise`, async () => {
    // Given
    const promise = Promise.resolve('success')

    // When
    const results = await allSettled(promise)

    // Then
    expect(results).toStrictEqual(['success'])
  })

  it(`should work for one single failed promise`, async () => {
    // Given
    const promise = Promise.reject('fail!')

    // When
    const results = await allSettled(promise)

    // Then
    expect(results).toStrictEqual([null])
  })
})
