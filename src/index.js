// @flow
import 'babel-polyfill'
import { createBrowserHistory } from 'history'
import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import theme from '~/theme/mui'
import AppRoutes from '~/routes'
import './index.scss'

const history = createBrowserHistory()
const enhancers = [
  applyMiddleware(
    thunk,
    routerMiddleware(history),
  ),
]
const finalCreateStore = compose(...enhancers)

const reducers = combineReducers({
  routing: routerReducer,
})

const store = createStore(reducers, finalCreateStore)

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <AppRoutes />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
)

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
)
