// 
import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import { updateAddressBookEntry } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import fetchCollectibles from '~/logic/collectibles/store/actions/fetchCollectibles'
import fetchCurrencyValues from '~/logic/currencyValues/store/actions/fetchCurrencyValues'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'
import activateAssetsByBalance from '~/logic/tokens/store/actions/activateAssetsByBalance'
import activateTokensByBalance from '~/logic/tokens/store/actions/activateTokensByBalance'
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'
import createTransaction from '~/routes/safe/store/actions/createTransaction'
import fetchEtherBalance from '~/routes/safe/store/actions/fetchEtherBalance'
import fetchLatestMasterContractVersion from '~/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe, { checkAndUpdateSafe } from '~/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import processTransaction from '~/routes/safe/store/actions/processTransaction'
import updateSafe from '~/routes/safe/store/actions/updateSafe'


export default {
  fetchSafe,
  fetchTokenBalances,
  createTransaction,
  processTransaction,
  fetchCollectibles,
  fetchTokens,
  fetchTransactions,
  activateTokensByBalance,
  activateAssetsByBalance,
  updateSafe,
  fetchEtherBalance,
  fetchLatestMasterContractVersion,
  fetchCurrencyValues,
  checkAndUpdateSafeOwners: checkAndUpdateSafe,
  loadAddressBook: loadAddressBookFromStorage,
  updateAddressBookEntry,
  addViewedSafe,
}
