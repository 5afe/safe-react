import { Map } from 'immutable'
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
import currencyValues, {
  CURRENCY_REDUCER_ID,
  CurrencyValuesState,
  initialCurrencyState,
} from 'src/logic/currencyValues/store/reducer/currencyValues'
import networkConfig, { NETWORK_CONFIG_REDUCER_ID } from 'src/logic/config/store/reducer'
import { NetworkState } from 'src/logic/config/model/networkConfig'
import { configMiddleware } from 'src/logic/config/store/middleware'
import appearance, { AppearanceState, APPEARANCE_REDUCER_ID } from 'src/logic/appearance/reducer/appearance'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const currencyLocalStorageKey = `${CURRENCY_REDUCER_ID}.selectedCurrency`

const localStorageConfig = {
  states: [ADDRESS_BOOK_REDUCER_ID, currencyLocalStorageKey, APPEARANCE_REDUCER_ID],
  namespace: 'SAFE',
  namespaceSeparator: '__',
  disableWarnings: true,
  preloadedState: {
    [CURRENCY_REDUCER_ID]: initialCurrencyState,
  },
}

const finalCreateStore = composeEnhancers(
  applyMiddleware(
    thunk,
    save(localStorageConfig),
    notificationsMiddleware,
    safeStorageMiddleware,
    providerWatcher,
    addressBookMiddleware,
    configMiddleware,
  ),
)

const reducers = combineReducers({
  [PROVIDER_REDUCER_ID]: provider,
  [SAFE_REDUCER_ID]: safe,
  [NFT_ASSETS_REDUCER_ID]: nftAssetReducer,
  [NFT_TOKENS_REDUCER_ID]: nftTokensReducer,
  [TOKEN_REDUCER_ID]: tokens,
  [GATEWAY_TRANSACTIONS_ID]: gatewayTransactions,
  [NOTIFICATIONS_REDUCER_ID]: notifications,
  [CURRENCY_REDUCER_ID]: currencyValues,
  [COOKIES_REDUCER_ID]: cookies,
  [ADDRESS_BOOK_REDUCER_ID]: addressBook,
  [CURRENT_SESSION_REDUCER_ID]: currentSession,
  [NETWORK_CONFIG_REDUCER_ID]: networkConfig,
  [APPEARANCE_REDUCER_ID]: appearance,
})

export type AppReduxState = CombinedState<{
  [PROVIDER_REDUCER_ID]: ProviderState
  [SAFE_REDUCER_ID]: SafeReducerMap
  [NFT_ASSETS_REDUCER_ID]: NFTAssets
  [NFT_TOKENS_REDUCER_ID]: NFTTokens
  [TOKEN_REDUCER_ID]: TokenState
  [GATEWAY_TRANSACTIONS_ID]: Record<string, Record<string, StoreStructure>>
  [NOTIFICATIONS_REDUCER_ID]: Map<string, Notification>
  [CURRENCY_REDUCER_ID]: CurrencyValuesState
  [COOKIES_REDUCER_ID]: Map<string, any>
  [ADDRESS_BOOK_REDUCER_ID]: AddressBookState
  [CURRENT_SESSION_REDUCER_ID]: CurrentSessionState
  [NETWORK_CONFIG_REDUCER_ID]: NetworkState
  [APPEARANCE_REDUCER_ID]: AppearanceState
}>

export const store: any = createStore(reducers, load(localStorageConfig), finalCreateStore)

export const createCustomStore: any = (customStore: any) => createStore(reducers, { ...customStore }, finalCreateStore)

export const aNewStore = (localState?: PreloadedState<unknown>): Store =>
  createStore(reducers, localState, finalCreateStore)
