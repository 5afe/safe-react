// @flow
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {
  combineReducers, createStore, applyMiddleware, compose, type Reducer, type Store,
} from 'redux'
import thunk from 'redux-thunk'
import safe, { SAFE_REDUCER_ID, type SafeReducerState as SafeState } from '~/routes/safe/store/reducer/safe'
import safeStorage from '~/routes/safe/store/middleware/safeStorage'
import providerWatcher from '~/logic/wallets/store/middlewares/providerWatcher'
import transactions, {
  type State as TransactionsState,
  TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/transactions'
import cancellationTransactions, {
  type CancelState as CancelTransactionsState,
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/cancellationTransactions'
import incomingTransactions, {
  type IncomingState as IncomingTransactionsState,
  INCOMING_TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/incomingTransactions'
import provider, { PROVIDER_REDUCER_ID, type State as ProviderState } from '~/logic/wallets/store/reducer/provider'
import tokens, { TOKEN_REDUCER_ID, type State as TokensState } from '~/logic/tokens/store/reducer/tokens'
import notifications, {
  NOTIFICATIONS_REDUCER_ID,
  type NotificationReducerState as NotificationsState,
} from '~/logic/notifications/store/reducer/notifications'
import currencyValues, { CURRENCY_VALUES_KEY } from '~/logic/currencyValues/store/reducer/currencyValues'
import cookies, { COOKIES_REDUCER_ID } from '~/logic/cookies/store/reducer/cookies'
import notificationsMiddleware from '~/routes/safe/store/middleware/notificationsMiddleware'
import addressBook, { ADDRESS_BOOK_REDUCER_ID } from '~/logic/addressBook/store/reducer/addressBook'
import addressBookMiddleware from '~/logic/addressBook/store/middleware/addressBookMiddleware'
import currentSession, {
  CURRENT_SESSION_REDUCER_ID,
  type State as CurrentSessionState,
} from '~/logic/currentSession/store/reducer/currentSession'

export const history = createBrowserHistory()

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const finalCreateStore = composeEnhancers(
  applyMiddleware(thunk, routerMiddleware(history), safeStorage, providerWatcher, notificationsMiddleware, addressBookMiddleware),
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

const reducers: Reducer<GlobalState> = combineReducers({
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

export const store: Store<GlobalState> = createStore(reducers, finalCreateStore)

// eslint-disable-next-line max-len
export const aNewStore = (localState?: Object): Store<GlobalState> => createStore(reducers, localState, finalCreateStore)
