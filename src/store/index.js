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
import provider, { PROVIDER_REDUCER_ID, type State as ProviderState } from '~/logic/wallets/store/reducer/provider'
import tokens, { TOKEN_REDUCER_ID, type State as TokensState } from '~/logic/tokens/store/reducer/tokens'
import notifications, {
  NOTIFICATIONS_REDUCER_ID,
  type NotificationReducerState as NotificationsState,
} from '~/logic/notifications/store/reducer/notifications'


export const history = createBrowserHistory()

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const finalCreateStore = composeEnhancers(
  applyMiddleware(thunk, routerMiddleware(history), safeStorage, providerWatcher),
)

export type GlobalState = {
  providers: ProviderState,
  safes: SafeState,
  tokens: TokensState,
  transactions: TransactionsState,
  notifications: NotificationsState,
}

export type GetState = () => GlobalState

const reducers: Reducer<GlobalState> = combineReducers({
  router: connectRouter(history),
  [PROVIDER_REDUCER_ID]: provider,
  [SAFE_REDUCER_ID]: safe,
  [TOKEN_REDUCER_ID]: tokens,
  [TRANSACTIONS_REDUCER_ID]: transactions,
  [NOTIFICATIONS_REDUCER_ID]: notifications,
})

export const store: Store<GlobalState> = createStore(reducers, finalCreateStore)

// eslint-disable-next-line max-len
export const aNewStore = (localState?: Object): Store<GlobalState> => createStore(reducers, localState, finalCreateStore)
