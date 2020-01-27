// @flow
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BigNumber } from 'bignumber.js'
import Root from '~/components/Root'
import loadActiveTokens from '~/logic/tokens/store/actions/loadActiveTokens'
import loadDefaultSafe from '~/routes/safe/store/actions/loadDefaultSafe'
import loadSafesFromStorage from '~/routes/safe/store/actions/loadSafesFromStorage'
import loadCurrentSessionFromStorage from '~/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import { store } from '~/safeStore'

BigNumber.set({ EXPONENTIAL_AT: [-7, 255] })

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

// $FlowFixMe
store.dispatch(loadActiveTokens())
// $FlowFixMe
store.dispatch(loadSafesFromStorage())
// $FlowFixMe
store.dispatch(loadDefaultSafe())
// $FlowFixMe
store.dispatch(loadCurrentSessionFromStorage())

const root = document.getElementById('root')

if (root !== null) {
  ReactDOM.render(<Root />, root)
}
