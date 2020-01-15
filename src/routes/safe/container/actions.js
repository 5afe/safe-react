// @flow
import fetchSafe, { checkAndUpdateSafe } from '~/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import fetchEtherBalance from '~/routes/safe/store/actions/fetchEtherBalance'
import createTransaction from '~/routes/safe/store/actions/createTransaction'
import processTransaction from '~/routes/safe/store/actions/processTransaction'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'
import fetchCurrencyValues from '~/logic/currencyValues/store/actions/fetchCurrencyValues'
import activateTokensByBalance from '~/logic/tokens/store/actions/activateTokensByBalance'
import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import loadCurrentSessionFromStorage from '~/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokenBalances: typeof fetchTokenBalances,
  createTransaction: typeof createTransaction,
  fetchTransactions: typeof fetchTransactions,
  updateSafe: typeof updateSafe,
  fetchTokens: typeof fetchTokens,
  processTransaction: typeof processTransaction,
  fetchEtherBalance: typeof fetchEtherBalance,
  activateTokensByBalance: typeof activateTokensByBalance,
  checkAndUpdateSafeOwners: typeof checkAndUpdateSafe,
  fetchCurrencyValues: typeof fetchCurrencyValues,
  loadAddressBook: typeof loadAddressBookFromStorage,
  loadCurrentSession: typeof loadCurrentSessionFromStorage,
  addViewedSafe: typeof addViewedSafe,
}

export default {
  fetchSafe,
  fetchTokenBalances,
  createTransaction,
  processTransaction,
  fetchTokens,
  fetchTransactions,
  activateTokensByBalance,
  updateSafe,
  fetchEtherBalance,
  fetchCurrencyValues,
  checkAndUpdateSafeOwners: checkAndUpdateSafe,
  loadAddressBook: loadAddressBookFromStorage,
  loadCurrentSession: loadCurrentSessionFromStorage,
  addViewedSafe,
}
