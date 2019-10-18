// @flow

// This is pretty new so I'll leave the docs here
// https://v8.dev/features/intl-numberformat
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat

// Locale is an empty array because we want it to use user's locale
const lt1kFormatter = new Intl.NumberFormat([], { maximumFractionDigits: 5 })
const lt10kFormatter = new Intl.NumberFormat([], { maximumFractionDigits: 4 })
const lt100kFormatter = new Intl.NumberFormat([], { maximumFractionDigits: 3 })
const lt1mFormatter = new Intl.NumberFormat([], { maximumFractionDigits: 2 })
const lt10mFormatter = new Intl.NumberFormat([], { maximumFractionDigits: 1 })
const lt100mFormatter = new Intl.NumberFormat([], { maximumFractionDigits: 0 })
// same format for billions and trillions
const lt1000tFormatter = new Intl.NumberFormat([], { maximumFractionDigits: 3, notation: 'compact' })

export const formatAmount = (number: string | number) => {
  let numberFloat = parseFloat(number)

  if (numberFloat < 1000) {
    numberFloat = lt1kFormatter.format(numberFloat)
  } else if (numberFloat < 10000) {
    numberFloat = lt10kFormatter.format(numberFloat)
  } else if (numberFloat < 100000) {
    numberFloat = lt100kFormatter.format(numberFloat)
  } else if (numberFloat < 1000000) {
    numberFloat = lt1mFormatter.format(numberFloat)
  } else if (numberFloat < 10000000) {
    numberFloat = lt10mFormatter.format(numberFloat)
  } else if (numberFloat < 100000000) {
    numberFloat = lt100mFormatter.format(numberFloat)
  } else if (numberFloat < 10 ** 15) {
    numberFloat = lt1000tFormatter.format(numberFloat)
  } else {
    numberFloat = '> 1000T'
  }

  return numberFloat
}
