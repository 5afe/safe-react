// @flow
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Root from '~/components/Root'
import { store } from '~/store'
import loadSafesFromStorage from '~/routes/safe/store/actions/loadSafesFromStorage'
import loadActiveTokens from '~/logic/tokens/store/actions/loadActiveTokens'
import loadDefaultSafe from '~/routes/safe/store/actions/loadDefaultSafe'
import loadCookiesFromStorage from '~/logic/cookies/store/actions/loadCookiesFromStorage'

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

store.dispatch(loadActiveTokens())
store.dispatch(loadSafesFromStorage())
store.dispatch(loadDefaultSafe())
store.dispatch(loadCookiesFromStorage())

ReactDOM.render(<Root />, document.getElementById('root'))
