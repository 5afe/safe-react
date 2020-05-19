import { textShortener } from 'src/utils/strings'

describe('Utils > strings > textShortener', () => {
  it(`should return the original string if there's no room to shorten`, () => {
    // Given
    const text = "I'm a short string"
    const shortener = textShortener() // default values

    // When
    const shortenText = shortener(text)

    // Then
    expect(shortenText).toEqual(text)
  })

  it(`should return a shorter version with the default ellipsis`, () => {
    // Given
    const text = "I'm a short string" // 18 chars long
    const shortener = textShortener({ charsStart: 2, charsEnd: 2 })

    // When
    const shortenText = shortener(text)

    // Then
    expect(shortenText).toEqual("I'...ng")
  })

  it(`should return a shorter version with the '---' ellipsis`, () => {
    // Given
    const text = "I'm a short string" // 18 chars long
    const shortener = textShortener({ charsStart: 2, charsEnd: 2, ellipsis: '---' })

    // When
    const shortenText = shortener(text)

    // Then
    expect(shortenText).toEqual("I'---ng")
  })

  it(`should return a shorter version with only the start of the string`, () => {
    // Given
    const text = "I'm a short string" // 18 chars long
    const shortener = textShortener({ charsStart: 2, charsEnd: 0 })

    // When
    const shortenText = shortener(text)

    // Then
    expect(shortenText).toEqual("I'...")
  })

  it(`should return a shorter version with only the end of the string`, () => {
    // Given
    const text = "I'm a short string" // 18 chars long
    const shortener = textShortener({ charsStart: 0, charsEnd: 2 })

    // When
    const shortenText = shortener(text)

    // Then
    expect(shortenText).toEqual('...ng')
  })
})
