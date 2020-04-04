// 
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import addressBookMiddleware from '~/logic/addressBook/store/middleware/addressBookMiddleware'
import addressBook, { ADDRESS_BOOK_REDUCER_ID } from '~/logic/addressBook/store/reducer/addressBook'
import {
  NFT_ASSETS_REDUCER_ID,
  NFT_TOKENS_REDUCER_ID,
  nftAssetReducer,
  nftTokensReducer,
} from '~/logic/collectibles/store/reducer/collectibles'
import cookies, { COOKIES_REDUCER_ID } from '~/logic/cookies/store/reducer/cookies'
import currencyValues, { CURRENCY_VALUES_KEY } from '~/logic/currencyValues/store/reducer/currencyValues'
import currentSession, {
  CURRENT_SESSION_REDUCER_ID,
} from '~/logic/currentSession/store/reducer/currentSession'
import notifications, {
  NOTIFICATIONS_REDUCER_ID,
} from '~/logic/notifications/store/reducer/notifications'
import tokens, { TOKEN_REDUCER_ID, } from '~/logic/tokens/store/reducer/tokens'
import providerWatcher from '~/logic/wallets/store/middlewares/providerWatcher'
import provider, { PROVIDER_REDUCER_ID, } from '~/logic/wallets/store/reducer/provider'
import notificationsMiddleware from '~/routes/safe/store/middleware/notificationsMiddleware'
import safeStorage from '~/routes/safe/store/middleware/safeStorage'
import cancellationTransactions, {
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/cancellationTransactions'
import incomingTransactions, {
  INCOMING_TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/incomingTransactions'
import safe, { SAFE_REDUCER_ID, } from '~/routes/safe/store/reducer/safe'
import transactions, {
  TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/transactions'

export const history = createHashHistory({ hashType: 'slash' })

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const finalCreateStore = composeEnhancers(
  applyMiddleware(
    thunk,
    routerMiddleware(history),
    safeStorage,
    providerWatcher,
    notificationsMiddleware,
    addressBookMiddleware,
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
})

export const store = createStore(reducers, finalCreateStore)

export const aNewStore = (localState) =>
  createStore(reducers, localState, finalCreateStore)
