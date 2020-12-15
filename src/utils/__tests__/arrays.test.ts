import { equalArrays } from 'src/utils/arrays'

describe('Utils > strings > equalArrays', () => {
  it(`Given two arrays with the same content, should return true`, () => {
    // Given
    const array1 = ['1', '2', '3']
    const array2 = ['1', '2', '3']

    // When
    const expectedResult = equalArrays(array1, array2)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given two empty arrays, should return true`, () => {
    // Given
    const array1 = []
    const array2 = []

    // When
    const expectedResult = equalArrays(array1, array2)

    // Then
    expect(expectedResult).toEqual(true)
  })
  it(`Given two arrays with the different content, should return false`, () => {
    // Given
    const array1 = ['1', '2', '3']
    const array2 = ['1', '2']

    // When
    const expectedResult = equalArrays(array1, array2)

    // Then
    expect(expectedResult).toEqual(false)
  })
  it(`Given first array null and second not null, should return false`, () => {
    // Given
    const array1 = null
    const array2 = ['1', '2', '3']

    // When
    const expectedResult = equalArrays(array1, array2)

    // Then
    expect(expectedResult).toEqual(false)
  })
  it(`Given second array null and first one not null, should return false`, () => {
    // Given
    const array1 = ['1', '2', '3']
    const array2 = null

    // When
    const expectedResult = equalArrays(array1, array2)

    // Then
    expect(expectedResult).toEqual(false)
  })
  it(`Given two nulls array, should return true`, () => {
    // Given
    const array1 = null
    const array2 = null

    // When
    const expectedResult = equalArrays(array1, array2)

    // Then
    expect(expectedResult).toEqual(true)
  })
})
