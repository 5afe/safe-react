// @flow
export const formatAmount = (number: string | number) => {
  let numberFloat = parseFloat(number)

  if (numberFloat < 999.999999) {
    numberFloat = numberFloat.toFixed(2).toLocaleString()
  }

  return numberFloat
}
