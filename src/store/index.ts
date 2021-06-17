import { Map } from 'immutable'
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, combineReducers, compose, createStore, CombinedState, PreloadedState, Store } from 'redux'
import { save, load } from 'redux-localstorage-simple'
import thunk from 'redux-thunk'

import { addressBookMiddleware } from 'src/logic/addressBook/store/middleware'
import addressBook, { ADDRESS_BOOK_REDUCER_ID } from 'src/logic/addressBook/store/reducer'
import {
  NFT_ASSETS_REDUCER_ID,
  NFT_TOKENS_REDUCER_ID,
  nftAssetReducer,
  nftTokensReducer,
} from 'src/logic/collectibles/store/reducer/collectibles'
import cookies, { COOKIES_REDUCER_ID } from 'src/logic/cookies/store/reducer/cookies'
import currentSession, {
  CURRENT_SESSION_REDUCER_ID,
  CurrentSessionState,
} from 'src/logic/currentSession/store/reducer/currentSession'
import { Notification } from 'src/logic/notifications'
import notifications, { NOTIFICATIONS_REDUCER_ID } from 'src/logic/notifications/store/reducer/notifications'
import { StoreStructure } from 'src/logic/safe/store/models/types/gateway'
import { gatewayTransactions, GATEWAY_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/gatewayTransactions'
import tokens, { TOKEN_REDUCER_ID, TokenState } from 'src/logic/tokens/store/reducer/tokens'
import providerWatcher from 'src/logic/wallets/store/middlewares/providerWatcher'
import provider, { PROVIDER_REDUCER_ID, ProviderState } from 'src/logic/wallets/store/reducer/provider'
import notificationsMiddleware from 'src/logic/safe/store/middleware/notificationsMiddleware'
import { safeStorageMiddleware } from 'src/logic/safe/store/middleware/safeStorage'
import safe, { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import { NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/collectibles.d'
import { SafeReducerMap } from 'src/logic/safe/store/reducer/types/safe'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import migrateAddressBook from 'src/logic/addressBook/utils/v2-migration'
import currencyValues, {
  CURRENCY_VALUES_KEY,
  CurrencyValuesState,
} from 'src/logic/currencyValues/store/reducer/currencyValues'
import { currencyValuesStorageMiddleware } from 'src/logic/currencyValues/store/middleware/currencyValuesStorageMiddleware'

export const history = createHashHistory()

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const localStorageConfig = { states: [ADDRESS_BOOK_REDUCER_ID], namespace: 'SAFE', namespaceSeparator: '__' }

const finalCreateStore = composeEnhancers(
  applyMiddleware(
    thunk,
    save(localStorageConfig),
    routerMiddleware(history),
    notificationsMiddleware,
    safeStorageMiddleware,
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
  [GATEWAY_TRANSACTIONS_ID]: gatewayTransactions,
  [NOTIFICATIONS_REDUCER_ID]: notifications,
  [CURRENCY_VALUES_KEY]: currencyValues,
  [COOKIES_REDUCER_ID]: cookies,
  [ADDRESS_BOOK_REDUCER_ID]: addressBook,
  [CURRENT_SESSION_REDUCER_ID]: currentSession,
})

export type AppReduxState = CombinedState<{
  [PROVIDER_REDUCER_ID]: ProviderState
  [SAFE_REDUCER_ID]: SafeReducerMap
  [NFT_ASSETS_REDUCER_ID]: NFTAssets
  [NFT_TOKENS_REDUCER_ID]: NFTTokens
  [TOKEN_REDUCER_ID]: TokenState
  [GATEWAY_TRANSACTIONS_ID]: Record<string, StoreStructure>
  [NOTIFICATIONS_REDUCER_ID]: Map<string, Notification>
  [CURRENCY_VALUES_KEY]: CurrencyValuesState
  [COOKIES_REDUCER_ID]: Map<string, any>
  [ADDRESS_BOOK_REDUCER_ID]: AddressBookState
  [CURRENT_SESSION_REDUCER_ID]: CurrentSessionState
  router: RouterState
}>

// Address Book v2 migration
migrateAddressBook(localStorageConfig)

export const store: any = createStore(reducers, load(localStorageConfig), finalCreateStore)

export const aNewStore = (localState?: PreloadedState<unknown>): Store =>
  createStore(reducers, localState, finalCreateStore)
