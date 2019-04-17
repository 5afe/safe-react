// @flow
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Root from '~/components/Root'
import { store } from '~/store'
import loadSafesFromStorage from '~/routes/safe/store/actions/loadSafesFromStorage'
import loadActiveTokens from '~/logic/tokens/store/actions/loadActiveTokens'

store.dispatch(loadActiveTokens())
store.dispatch(loadSafesFromStorage())

ReactDOM.render(<Root />, document.getElementById('root'))
