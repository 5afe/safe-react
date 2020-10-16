import { Map } from 'immutable'
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, combineReducers, compose, createStore, CombinedState, PreloadedState, Store } from 'redux'
import thunk from 'redux-thunk'

import addressBookMiddleware from 'src/logic/addressBook/store/middleware/addressBookMiddleware'
import addressBook, { ADDRESS_BOOK_REDUCER_ID } from 'src/logic/addressBook/store/reducer/addressBook'
import {
  NFT_ASSETS_REDUCER_ID,
  NFT_TOKENS_REDUCER_ID,
  nftAssetReducer,
  nftTokensReducer,
} from 'src/logic/collectibles/store/reducer/collectibles'
import cookies, { COOKIES_REDUCER_ID } from 'src/logic/cookies/store/reducer/cookies'
import currencyValuesStorageMiddleware from 'src/logic/currencyValues/store/middleware'
import currencyValues, {
  CURRENCY_VALUES_KEY,
  CurrencyValuesState,
} from 'src/logic/currencyValues/store/reducer/currencyValues'
import currentSession, {
  CURRENT_SESSION_REDUCER_ID,
  CurrentSessionState,
} from 'src/logic/currentSession/store/reducer/currentSession'
import notifications, { NOTIFICATIONS_REDUCER_ID } from 'src/logic/notifications/store/reducer/notifications'
import tokens, { TOKEN_REDUCER_ID, TokenState } from 'src/logic/tokens/store/reducer/tokens'
import providerWatcher from 'src/logic/wallets/store/middlewares/providerWatcher'
import provider, { PROVIDER_REDUCER_ID, ProviderState } from 'src/logic/wallets/store/reducer/provider'
import notificationsMiddleware from 'src/logic/safe/store/middleware/notificationsMiddleware'
import safeStorage from 'src/logic/safe/store/middleware/safeStorage'
import cancellationTransactions, {
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
  CancellationTxState,
} from 'src/logic/safe/store/reducer/cancellationTransactions'
import incomingTransactions, {
  INCOMING_TRANSACTIONS_REDUCER_ID,
} from 'src/logic/safe/store/reducer/incomingTransactions'
import safe, { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import transactions, { TRANSACTIONS_REDUCER_ID } from 'src/logic/safe/store/reducer/transactions'
import { NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/collectibles.d'
import { SafeReducerMap } from 'src/routes/safe/store/reducer/types/safe'
import allTransactions, { TRANSACTIONS, TransactionsState } from '../logic/safe/store/reducer/allTransactions'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'

export const history = createHashHistory()

// eslint-disable-next-line
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const finalCreateStore = composeEnhancers(
  applyMiddleware(
    thunk,
    routerMiddleware(history),
    notificationsMiddleware,
    safeStorage,
    providerWatcher,
    addressBookMiddleware,
    currencyValuesStorageMiddleware,
  ),
)

const reducers = combineReducers({
  router: connectRouter(history),
  [PROVIDER_REDUCER_ID]: provider,
  [SAFE_REDUCER_ID]: safe,
  [NFT_ASSETS_REDUCER_ID]: nftAssetReducer,
  [NFT_TOKENS_REDUCER_ID]: nftTokensReducer,
  [TOKEN_REDUCER_ID]: tokens,
  [TRANSACTIONS_REDUCER_ID]: transactions,
  [CANCELLATION_TRANSACTIONS_REDUCER_ID]: cancellationTransactions,
  [INCOMING_TRANSACTIONS_REDUCER_ID]: incomingTransactions,
  [NOTIFICATIONS_REDUCER_ID]: notifications,
  [CURRENCY_VALUES_KEY]: currencyValues,
  [COOKIES_REDUCER_ID]: cookies,
  [ADDRESS_BOOK_REDUCER_ID]: addressBook,
  [CURRENT_SESSION_REDUCER_ID]: currentSession,
  [TRANSACTIONS]: allTransactions,
})

export type AppReduxState = CombinedState<{
  [PROVIDER_REDUCER_ID]: ProviderState
  [SAFE_REDUCER_ID]: SafeReducerMap
  [NFT_ASSETS_REDUCER_ID]: NFTAssets
  [NFT_TOKENS_REDUCER_ID]: NFTTokens
  [TOKEN_REDUCER_ID]: TokenState
  [TRANSACTIONS_REDUCER_ID]: Map<string, any>
  [CANCELLATION_TRANSACTIONS_REDUCER_ID]: CancellationTxState
  [INCOMING_TRANSACTIONS_REDUCER_ID]: Map<string, any>
  [NOTIFICATIONS_REDUCER_ID]: Map<string, any>
  [CURRENCY_VALUES_KEY]: CurrencyValuesState
  [COOKIES_REDUCER_ID]: Map<string, any>
  [ADDRESS_BOOK_REDUCER_ID]: AddressBookState
  [CURRENT_SESSION_REDUCER_ID]: CurrentSessionState
  [TRANSACTIONS]: TransactionsState
  router: RouterState
}>

export const store: any = createStore(reducers, finalCreateStore)

export const aNewStore = (localState?: PreloadedState<unknown>): Store =>
  createStore(reducers, localState, finalCreateStore)
