/**
 * When creating a new error type, please try to group them semantically
 * with the existing errors in the same hundred. For example, if it's
 * related to fetching data from the backend, add it to the 6xx errors.
 * This is not a hard requirement, just a useful convention.
 */
enum ErrorCodes {
  ___0 = '0: No such error code',
  _100 = '100: Invalid input in the address field',
  _101 = '101: Failed to resolve the address',
  _200 = '200: Failed migrating to the address book v2',
  _600 = '600: Error fetching token list',
  _601 = '601: Error fetching balances',
  _602 = '602: Error fetching history txs',
  _603 = '603: Error fetching queued txs',
  _604 = '604: Error fetching collectibles',
  _605 = '605: Error fetching safe info',
  _606 = '605: Error fetching safe version',
  _607 = '607: Error fetching available currencies',
  _701 = '701: Failed to get local safe info',
  _900 = '900: Error loading Safe App',
  _901 = '901: Error processing Safe Apps SDK request',
}

export default ErrorCodes
