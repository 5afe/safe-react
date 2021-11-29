import { applyMiddleware, combineReducers, compose, createStore, PreloadedState } from 'redux'
import { save, load, LoadOptions, RLSOptions } from 'redux-localstorage-simple'
import thunk from 'redux-thunk'

import { addressBookMiddleware } from 'src/logic/addressBook/store/middleware'
import addressBookReducer, {
  ADDRESS_BOOK_REDUCER_ID,
  initialAddressBookState,
} from 'src/logic/addressBook/store/reducer'
import {
  NFT_ASSETS_REDUCER_ID,
  NFT_TOKENS_REDUCER_ID,
  nftAssetReducer,
  nftTokensReducer,
} from 'src/logic/collectibles/store/reducer/collectibles'
import cookiesReducer, { COOKIES_REDUCER_ID } from 'src/logic/cookies/store/reducer/cookies'
import currentSessionReducer, {
  CURRENT_SESSION_REDUCER_ID,
} from 'src/logic/currentSession/store/reducer/currentSession'
import notificationsReducer, { NOTIFICATIONS_REDUCER_ID } from 'src/logic/notifications/store/reducer/notifications'
import gatewayTransactionsReducer, { GATEWAY_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/gatewayTransactions'
import tokensReducer, { TOKEN_REDUCER_ID } from 'src/logic/tokens/store/reducer/tokens'
import providerWatcher from 'src/logic/wallets/store/middlewares/providerWatcher'
import providerReducer, { PROVIDER_REDUCER_ID } from 'src/logic/wallets/store/reducer/provider'
import notificationsMiddleware from 'src/logic/safe/store/middleware/notificationsMiddleware'
import { safeStorageMiddleware } from 'src/logic/safe/store/middleware/safeStorage'
import safeReducer, { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import currencyValues, {
  CURRENCY_REDUCER_ID,
  initialCurrencyState,
} from 'src/logic/currencyValues/store/reducer/currencyValues'
import configReducer, { CONFIG_REDUCER_ID } from 'src/logic/config/store/reducer'
import { configMiddleware } from 'src/logic/config/store/middleware'
import appearanceReducer, { APPEARANCE_REDUCER_ID } from 'src/logic/appearance/reducer/appearance'

const CURRENCY_KEY = `${CURRENCY_REDUCER_ID}.selectedCurrency`
const LOCAL_STORAGE_CONFIG: RLSOptions | LoadOptions = {
  states: [ADDRESS_BOOK_REDUCER_ID, CURRENCY_KEY, APPEARANCE_REDUCER_ID],
  namespace: 'SAFE',
  namespaceSeparator: '__',
  disableWarnings: true,
  preloadedState: {
    [CURRENCY_REDUCER_ID]: initialCurrencyState,
    [ADDRESS_BOOK_REDUCER_ID]: initialAddressBookState,
  },
}

const composeEnhancers = ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose
const enhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    save(LOCAL_STORAGE_CONFIG),
    notificationsMiddleware,
    safeStorageMiddleware,
    providerWatcher,
    addressBookMiddleware,
    configMiddleware,
  ),
)

const reducers = {
  [PROVIDER_REDUCER_ID]: providerReducer,
  [SAFE_REDUCER_ID]: safeReducer,
  [NFT_ASSETS_REDUCER_ID]: nftAssetReducer,
  [NFT_TOKENS_REDUCER_ID]: nftTokensReducer,
  [TOKEN_REDUCER_ID]: tokensReducer,
  [GATEWAY_TRANSACTIONS_ID]: gatewayTransactionsReducer,
  [NOTIFICATIONS_REDUCER_ID]: notificationsReducer,
  [CURRENCY_REDUCER_ID]: currencyValues,
  [COOKIES_REDUCER_ID]: cookiesReducer,
  [ADDRESS_BOOK_REDUCER_ID]: addressBookReducer,
  [CURRENT_SESSION_REDUCER_ID]: currentSessionReducer,
  [CONFIG_REDUCER_ID]: configReducer,
  [APPEARANCE_REDUCER_ID]: appearanceReducer,
}

const rootReducer = combineReducers(reducers)

export const store = createStore(rootReducer, load(LOCAL_STORAGE_CONFIG), enhancer)
export type AppReduxState = ReturnType<typeof store.getState>

export const createPreloadedStore = (localState?: PreloadedState<unknown>): typeof store =>
  createStore(rootReducer, localState, enhancer)
