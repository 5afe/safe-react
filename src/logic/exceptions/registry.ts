/**
 * When creating a new error type, please try to group them semantically
 * with the existing errors in the same hundred. For example, if it's
 * related to fetching data from the backend, add it to the 6xx errors.
 * This is not a hard requirement, just a useful convention.
 */
enum ErrorCodes {
  ___0 = '0: No such error code',
  _100 = '100: Invalid input in the address field',
  _200 = '200: Failed migrating to the address book v2',
  _600 = '600: Error fetching token list',
  _601 = '601: Error fetching balances',
}

export default ErrorCodes
