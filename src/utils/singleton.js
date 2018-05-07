// @flow
export const ensureOnce = (fn: Function): Function => {
  let executed = false
  let response

  return (...args) => {
    if (executed) { return response }

    executed = true
    // eslint-disable-next-line
    response = fn.apply(undefined, args)

    return response
  }
}
