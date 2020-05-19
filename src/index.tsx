import { BigNumber } from 'bignumber.js'
import React from 'react'
import ReactDOM from 'react-dom'

import Root from 'src/components/Root'
import loadCurrentSessionFromStorage from 'src/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import loadActiveTokens from 'src/logic/tokens/store/actions/loadActiveTokens'
import loadDefaultSafe from 'src/routes/safe/store/actions/loadDefaultSafe'
import loadSafesFromStorage from 'src/routes/safe/store/actions/loadSafesFromStorage'
import { store } from 'src/store'

BigNumber.set({ EXPONENTIAL_AT: [-7, 255] })

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

store.dispatch(loadActiveTokens())
store.dispatch(loadSafesFromStorage())
store.dispatch(loadDefaultSafe())
store.dispatch(loadCurrentSessionFromStorage())

const root = document.getElementById('root')

if (root !== null) {
  ReactDOM.render(<Root />, root)
}
