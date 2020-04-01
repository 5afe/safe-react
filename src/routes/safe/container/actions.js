// @flow
import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import fetchCollectibles from '~/logic/collectibles/store/actions/fetchCollectibles'
import fetchCurrencyValues from '~/logic/currencyValues/store/actions/fetchCurrencyValues'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'
import fetchEtherBalance from '~/routes/safe/store/actions/fetchEtherBalance'
import fetchLatestMasterContractVersion from '~/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe, { checkAndUpdateSafe } from '~/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import processTransaction from '~/routes/safe/store/actions/processTransaction'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokenBalances: typeof fetchTokenBalances,
  fetchTransactions: typeof fetchTransactions,
  fetchCollectibles: typeof fetchCollectibles,
  fetchTokens: typeof fetchTokens,
  fetchEtherBalance: typeof fetchEtherBalance,
  fetchLatestMasterContractVersion: typeof fetchLatestMasterContractVersion,
  checkAndUpdateSafeOwners: typeof checkAndUpdateSafe,
  fetchCurrencyValues: typeof fetchCurrencyValues,
  loadAddressBook: typeof loadAddressBookFromStorage,
  addViewedSafe: typeof addViewedSafe,
}

export default {
  fetchSafe,
  fetchTokenBalances,
  fetchTransactions,
  fetchCollectibles,
  fetchTokens,
  fetchEtherBalance,
  fetchLatestMasterContractVersion,
  checkAndUpdateSafeOwners: checkAndUpdateSafe,
  fetchCurrencyValues,
  loadAddressBook: loadAddressBookFromStorage,
  addViewedSafe,
  processTransaction,
}
