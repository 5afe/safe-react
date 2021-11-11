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
  _102 = '102: Error getting an address checksum',
  _200 = '200: Failed migrating to the address book v2',
  _300 = '300: Error switching the wallet network',
  _301 = '301: Error adding a new wallet network',
  _600 = '600: Error fetching token list',
  _601 = '601: Error fetching balances',
  _602 = '602: Error fetching history txs',
  _603 = '603: Error fetching queued txs',
  _604 = '604: Error fetching collectibles',
  _605 = '605: Safe not found',
  _606 = '605: Error fetching safe version',
  _607 = '607: Error fetching available currencies',
  _608 = '608: No next page',
  _609 = '609: Failed to retrieve SpendingLimits module information',
  _610 = '610: Error fetching safes by owner',
  _611 = '611: Error fetching gasPrice',
  _612 = '612: Error estimating gas',
  _613 = '613: Error fetching safe info',
  _700 = '700: Failed to load a localStorage item',
  _701 = '701: Failed to save a localStorage item',
  _702 = '702: Failed to remove a localStorage item',
  _703 = '703: Error migrating localStorage',
  _704 = '704: Failed to load a sessionStorage item',
  _705 = '705: Failed to save a sessionStorage item',
  _706 = '706: Failed to remove a sessionStorage item',
  _800 = '800: Safe creation tx failed',
  _801 = '801: Failed to send a tx with a spending limit',
  _802 = '802: Error submitting a transaction, safeAddress not found',
  _803 = '803: Error creating a transaction',
  _804 = '804: Error processing a transaction',
  _805 = '805: TX monitor error',
  _806 = '806: Failed to remove module',
  _807 = '806: Failed to remove guard',
  _900 = '900: Error loading Safe App',
  _901 = '901: Error processing Safe Apps SDK request',
  _902 = '902: Error loading Safe Apps list',
  _903 = '903: Error loading Safe App manifest',
}

export default ErrorCodes
