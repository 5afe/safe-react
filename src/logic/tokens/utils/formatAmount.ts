// This is pretty new so I'll leave the docs here
// https://v8.dev/features/intl-numberformat
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat

// Locale is undefined because we want it to use user's locale
const LOCALE = undefined

const lt1kFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 5 })
const lt10kFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 4 })
const lt100kFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 3 })
const lt1mFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 })
const lt10mFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 })
const lt100mFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
// same format for billions and trillions
const lt1000tFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 3, notation: 'compact' })
const gt1000tFormatter = new Intl.NumberFormat(LOCALE, { notation: 'compact' })

export const formatAmount = (number: string): string => {
  let numberFloat: number | string = parseFloat(number)

  if (numberFloat === 0) {
    numberFloat = '0'
  } else if (numberFloat < 0.001) {
    numberFloat = `< ${lt1kFormatter.format(0.001)}`
  } else if (numberFloat < 1_000) {
    numberFloat = lt1kFormatter.format(numberFloat)
  } else if (numberFloat < 10_000) {
    numberFloat = lt10kFormatter.format(numberFloat)
  } else if (numberFloat < 100_000) {
    numberFloat = lt100kFormatter.format(numberFloat)
  } else if (numberFloat < 1_000_000) {
    numberFloat = lt1mFormatter.format(numberFloat)
  } else if (numberFloat < 10_000_000) {
    numberFloat = lt10mFormatter.format(numberFloat)
  } else if (numberFloat < 100_000_000) {
    numberFloat = lt100mFormatter.format(numberFloat)
  } else if (numberFloat < 10 ** 15) {
    numberFloat = lt1000tFormatter.format(numberFloat)
  } else {
    // Localized '> 1000T'
    numberFloat = `> ${gt1000tFormatter.format(10 ** 15)}`
  }

  return numberFloat
}

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
})

export const formatCurrency = (amount: string, currencySelected: string): string => {
  const numberFloat = parseFloat(amount)
  return `${currencyFormatter.format(numberFloat)} ${currencySelected}`
}
