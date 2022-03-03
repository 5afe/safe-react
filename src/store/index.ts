import { applyMiddleware, CombinedState, combineReducers, compose, createStore, PreloadedState } from 'redux'
import { save, load, LoadOptions, RLSOptions } from 'redux-localstorage-simple'
import thunk from 'redux-thunk'

import { addressBookMiddleware } from 'src/logic/addressBook/store/middleware'
import addressBookReducer, { ADDRESS_BOOK_REDUCER_ID } from 'src/logic/addressBook/store/reducer'
import {
  NFT_ASSETS_REDUCER_ID,
  NFT_TOKENS_REDUCER_ID,
  nftAssetReducer,
  nftTokensReducer,
} from 'src/logic/collectibles/store/reducer/collectibles'
import cookiesReducer, { CookieState, COOKIES_REDUCER_ID } from 'src/logic/cookies/store/reducer/cookies'
import currentSessionReducer, {
  CurrentSessionState,
  CURRENT_SESSION_REDUCER_ID,
} from 'src/logic/currentSession/store/reducer/currentSession'
import notificationsReducer, { NOTIFICATIONS_REDUCER_ID } from 'src/logic/notifications/store/reducer/notifications'
import gatewayTransactionsReducer, {
  GatewayTransactionsState,
  GATEWAY_TRANSACTIONS_ID,
} from 'src/logic/safe/store/reducer/gatewayTransactions'
import {
  pendingTransactionsReducer,
  PendingTransactionsState,
  PENDING_TRANSACTIONS_ID,
} from 'src/logic/safe/store/reducer/pendingTransactions'
import tokensReducer, { TokenState, TOKEN_REDUCER_ID } from 'src/logic/tokens/store/reducer/tokens'
import providerMiddleware from 'src/logic/wallets/store/middleware'
import providerReducer, { ProvidersState, PROVIDER_REDUCER_ID } from 'src/logic/wallets/store/reducer'
import notificationsMiddleware from 'src/logic/safe/store/middleware/notificationsMiddleware'
import { safeStorageMiddleware } from 'src/logic/safe/store/middleware/safeStorage'
import safeReducer, { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import currencyValuesReducer, {
  CurrencyValuesState,
  CURRENCY_REDUCER_ID,
  initialCurrencyState,
} from 'src/logic/currencyValues/store/reducer/currencyValues'
import configReducer, { CONFIG_REDUCER_ID, initialConfigState } from 'src/logic/config/store/reducer'
import { configMiddleware } from 'src/logic/config/store/middleware'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import appearanceReducer, {
  APPEARANCE_REDUCER_ID,
  initialAppearanceState,
  AppearanceState,
} from 'src/logic/appearance/reducer/appearance'
import { NFTAssets, NFTTokens } from 'src/logic/collectibles/sources/collectibles'
import { SafeReducerMap } from 'src/logic/safe/store/reducer/types/safe'
import { LS_NAMESPACE, LS_SEPARATOR } from 'src/utils/constants'
import { ConfigState } from 'src/logic/config/store/reducer/reducer'
import { pendingTransactionsMiddleware } from 'src/logic/safe/store/middleware/pendingTransactionsMiddleware'
import { gatewayTransactionsMiddleware } from 'src/logic/safe/store/middleware/gatewayTransactionsMiddleware'

const CURRENCY_KEY = `${CURRENCY_REDUCER_ID}.selectedCurrency`

export const LS_CONFIG: RLSOptions | LoadOptions = {
  states: [ADDRESS_BOOK_REDUCER_ID, CURRENCY_KEY, APPEARANCE_REDUCER_ID, CONFIG_REDUCER_ID],
  namespace: LS_NAMESPACE,
  namespaceSeparator: LS_SEPARATOR,
  disableWarnings: true,
  preloadedState: {
    [CURRENCY_REDUCER_ID]: initialCurrencyState,
    [APPEARANCE_REDUCER_ID]: initialAppearanceState,
    [CONFIG_REDUCER_ID]: initialConfigState,
  },
}

const composeEnhancers = ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose
const enhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    save(LS_CONFIG),
    notificationsMiddleware,
    safeStorageMiddleware,
    providerMiddleware,
    addressBookMiddleware,
    configMiddleware,
    gatewayTransactionsMiddleware,
    pendingTransactionsMiddleware,
  ),
)

const reducers = {
  [PROVIDER_REDUCER_ID]: providerReducer,
  [SAFE_REDUCER_ID]: safeReducer,
  [NFT_ASSETS_REDUCER_ID]: nftAssetReducer,
  [NFT_TOKENS_REDUCER_ID]: nftTokensReducer,
  [TOKEN_REDUCER_ID]: tokensReducer,
  [GATEWAY_TRANSACTIONS_ID]: gatewayTransactionsReducer,
  [PENDING_TRANSACTIONS_ID]: pendingTransactionsReducer,
  [NOTIFICATIONS_REDUCER_ID]: notificationsReducer,
  [CURRENCY_REDUCER_ID]: currencyValuesReducer,
  [COOKIES_REDUCER_ID]: cookiesReducer,
  [ADDRESS_BOOK_REDUCER_ID]: addressBookReducer,
  [CURRENT_SESSION_REDUCER_ID]: currentSessionReducer,
  [CONFIG_REDUCER_ID]: configReducer,
  [APPEARANCE_REDUCER_ID]: appearanceReducer,
}

const rootReducer = combineReducers(reducers)

// There is a circular dep that prevents using:
// ReturnType<typeof store.getState>
// or https://dev.to/svehla/typescript-100-type-safe-react-redux-under-20-lines-4h8n
export type AppReduxState = CombinedState<{
  [PROVIDER_REDUCER_ID]: ProvidersState
  [SAFE_REDUCER_ID]: SafeReducerMap
  [NFT_ASSETS_REDUCER_ID]: NFTAssets
  [NFT_TOKENS_REDUCER_ID]: NFTTokens
  [TOKEN_REDUCER_ID]: TokenState
  [GATEWAY_TRANSACTIONS_ID]: GatewayTransactionsState
  [PENDING_TRANSACTIONS_ID]: PendingTransactionsState
  [NOTIFICATIONS_REDUCER_ID]: Map<string, Notification>
  [CURRENCY_REDUCER_ID]: CurrencyValuesState
  [COOKIES_REDUCER_ID]: CookieState
  [ADDRESS_BOOK_REDUCER_ID]: AddressBookState
  [CURRENT_SESSION_REDUCER_ID]: CurrentSessionState
  [CONFIG_REDUCER_ID]: ConfigState
  [APPEARANCE_REDUCER_ID]: AppearanceState
}>

export const store: any = createStore(rootReducer, load(LS_CONFIG), enhancer)

export const createPreloadedStore = (localState = {} as PreloadedState<unknown>): typeof store =>
  createStore(rootReducer, localState, enhancer)
