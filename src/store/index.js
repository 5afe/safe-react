// @flow
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { type CombinedReducer, type Store, applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import addressBookMiddleware from '~/logic/addressBook/store/middleware/addressBookMiddleware'
import addressBook, { ADDRESS_BOOK_REDUCER_ID } from '~/logic/addressBook/store/reducer/addressBook'
import cookies, { COOKIES_REDUCER_ID } from '~/logic/cookies/store/reducer/cookies'
import currencyValues, { CURRENCY_VALUES_KEY } from '~/logic/currencyValues/store/reducer/currencyValues'
import currentSession, {
  CURRENT_SESSION_REDUCER_ID,
  type State as CurrentSessionState,
} from '~/logic/currentSession/store/reducer/currentSession'
import notifications, {
  NOTIFICATIONS_REDUCER_ID,
  type NotificationReducerState as NotificationsState,
} from '~/logic/notifications/store/reducer/notifications'
import tokens, { TOKEN_REDUCER_ID, type State as TokensState } from '~/logic/tokens/store/reducer/tokens'
import providerWatcher from '~/logic/wallets/store/middlewares/providerWatcher'
import provider, { PROVIDER_REDUCER_ID, type State as ProviderState } from '~/logic/wallets/store/reducer/provider'
import notificationsMiddleware from '~/routes/safe/store/middleware/notificationsMiddleware'
import safeStorage from '~/routes/safe/store/middleware/safeStorage'
import cancellationTransactions, {
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
  type CancelState as CancelTransactionsState,
} from '~/routes/safe/store/reducer/cancellationTransactions'
import incomingTransactions, {
  INCOMING_TRANSACTIONS_REDUCER_ID,
  type IncomingState as IncomingTransactionsState,
} from '~/routes/safe/store/reducer/incomingTransactions'
import safe, { SAFE_REDUCER_ID, type SafeReducerState as SafeState } from '~/routes/safe/store/reducer/safe'
import transactions, {
  TRANSACTIONS_REDUCER_ID,
  type State as TransactionsState,
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

export type GlobalState = {
  providers: ProviderState,
  safes: SafeState,
  tokens: TokensState,
  transactions: TransactionsState,
  cancellationTransactions: CancelTransactionsState,
  incomingTransactions: IncomingTransactionsState,
  notifications: NotificationsState,
  currentSession: CurrentSessionState,
}

export type GetState = () => GlobalState

const reducers: CombinedReducer<GlobalState, *> = combineReducers({
  router: connectRouter(history),
  [PROVIDER_REDUCER_ID]: provider,
  [SAFE_REDUCER_ID]: safe,
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

export const store: Store<GlobalState, *> = createStore(reducers, finalCreateStore)

export const aNewStore = (localState?: Object): Store<GlobalState, *> =>
  createStore(reducers, localState, finalCreateStore)
