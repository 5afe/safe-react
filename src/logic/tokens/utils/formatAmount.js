// @flow

// Locale is an empty array because we want it to use user's locale
const lt1000Formatter = new Intl.NumberFormat([], { maximumFractionDigits: 5 })
const lt10000Formatter = new Intl.NumberFormat([], { maximumFractionDigits: 4 })
const lt100000Formatter = new Intl.NumberFormat([], { maximumFractionDigits: 3 })
const lt1000000Formatter = new Intl.NumberFormat([], { maximumFractionDigits: 2 })
const lt10000000Formatter = new Intl.NumberFormat([], { maximumFractionDigits: 1 })

export const formatAmount = (number: string | number) => {
  let numberFloat = parseFloat(number)

  if (numberFloat < 1000) {
    numberFloat = lt1000Formatter.format(numberFloat)
  } else if (numberFloat < 10000) {
    numberFloat = lt10000Formatter.format(numberFloat)
  } else if (numberFloat < 100000) {
    numberFloat = lt100000Formatter.format(numberFloat)
  } else if (numberFloat < 1000000) {
    numberFloat = lt1000000Formatter.format(numberFloat)
  } else if (numberFloat < 10000000) {
    numberFloat = lt10000000Formatter.format(numberFloat)
  }

  return numberFloat
}
