/**
 * Helper function to handle multiple async calls
 * It will return the expected value for each parameter passed when fulfilled or a `null` in case of an error
 * @param args
 * @returns Array<ExpectedValues>
 */
export const allSettled = async <ExpectedValues extends unknown[]>(...args: unknown[]): Promise<ExpectedValues> => {
  const data = new Array(args.length).fill(null)
  const promises = await Promise.allSettled(args)

  promises.forEach((promise, index) => {
    if (promise.status !== 'fulfilled') {
      console.error('Failed to retrieve async information', promise.reason)
    } else {
      data[index] = promise.value
    }
  })

  return data as ExpectedValues
}
