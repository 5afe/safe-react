export const equalArrays = (array1?: unknown[] | null, array2?: unknown[] | null): boolean => {
  if (array1 && !array2) {
    return false
  }

  if (!array1 && array2) {
    return false
  }

  if (!array1 && !array2) {
    return true
  }

  if (array1?.length !== array2?.length) {
    return false
  }

  return array1
    ? array1.every((element, index) => {
        return array2 ? element === array2[index] : false
      })
    : false
}
