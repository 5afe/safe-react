// @flow
export const ensureOnce = (fn: Function): Function => {
  let executed = false
  let response

  return (...args) => {
    if (executed) { return response }

    executed = true
    response = fn(args)

    return response
  }
}
