// @flow
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
export const formatAmount = (number: string | number) => {
  let numberFloat = parseFloat(number)

  if (numberFloat < 999.999999) {
    numberFloat = numberFloat.toFixed(5).toLocaleString()
  }

  return numberFloat
}
