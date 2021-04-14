/**
 * Helper function to handle multiple async calls
 * It will return the expected value for each parameter passed when fulfilled or a `null` in case of an error
 * @param args
 * @returns ExpectedValues
 */
export const allSettled = async <ExpectedValues>(...args): Promise<ExpectedValues> => {
  const data = new Array(args.length).fill(null)
  const promises = await Promise.allSettled(args)

  for (let i = 0; i < promises.length; i++) {
    const promise = promises[i]

    if (promise.status !== 'fulfilled') {
      console.error('Failed to retrieve async information', promise.reason)
    } else {
      data[i] = promise.value
    }
  }

  return (data as unknown) as ExpectedValues
}
