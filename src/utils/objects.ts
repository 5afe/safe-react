export const sortObject = (obj: Record<string, unknown>, order = 'asc'): any => {
  return Object.keys(obj)
    .sort((a: string, b: string) => Number(order === 'desc' ? b : a) - Number(order === 'desc' ? a : b))
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: obj[key],
      }),
      {},
    )
}
