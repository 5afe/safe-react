// 
import loadAddressBookFromStorage from 'src/logic/addressBook/store/actions/loadAddressBookFromStorage'
import { updateAddressBookEntry } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import fetchCollectibles from 'src/logic/collectibles/store/actions/fetchCollectibles'
import fetchCurrencyValues from 'src/logic/currencyValues/store/actions/fetchCurrencyValues'
import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import activateAssetsByBalance from 'src/logic/tokens/store/actions/activateAssetsByBalance'
import activateTokensByBalance from 'src/logic/tokens/store/actions/activateTokensByBalance'
import fetchTokens from 'src/logic/tokens/store/actions/fetchTokens'
import createTransaction from 'src/routes/safe/store/actions/createTransaction'
import fetchEtherBalance from 'src/routes/safe/store/actions/fetchEtherBalance'
import fetchLatestMasterContractVersion from 'src/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe, { checkAndUpdateSafe } from 'src/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from 'src/routes/safe/store/actions/fetchTokenBalances'
import fetchTransactions from 'src/routes/safe/store/actions/fetchTransactions'
import processTransaction from 'src/routes/safe/store/actions/processTransaction'
import updateSafe from 'src/routes/safe/store/actions/updateSafe'


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
