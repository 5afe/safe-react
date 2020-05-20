/**
 * Setups `shortenText` options
 * @param {object} opts
 * @param {number} opts.charsStart=10 - characters to preserve from the beginning
 * @param {number} opts.charsEnd=10 - characters to preserve at the end
 * @param {string} opts.ellipsis='...' - ellipsis characters
 * @returns {function} shortener
 */
export const textShortener = ({ charsEnd = 10, charsStart = 10, ellipsis = '...' } = {}) =>
  /**
   * @function
   * @name shortener
   *
   * Shortens a text string based on options
   * @param {string} text=null - String to shorten
   * @param text
   * @returns {string|?string}
   */
  (text = null) => {
    if (typeof text !== 'string') {
      throw new TypeError(` A string is required. ${typeof text} was provided instead.`)
    }

    if (!text) {
      return ''
    }

    const amountOfCharsToKeep = charsEnd + charsStart
    const finalStringLength = amountOfCharsToKeep + ellipsis.length

    if (finalStringLength >= text.length || !amountOfCharsToKeep) {
      // no need to shorten
      return text
    }

    const r = new RegExp(`^(.{${charsStart}}).+(.{${charsEnd}})$`)
    const matchResult = r.exec(text)

    if (!matchResult) {
      // if for any reason the exec returns null, the text remains untouched
      return text
    }

    const [, textStart, textEnd] = matchResult

    return `${textStart}${ellipsis}${textEnd}`
  }
