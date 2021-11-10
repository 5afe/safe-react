import { BigNumber } from 'bignumber.js'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import Root from 'src/components/Root'
import loadCurrentSessionFromStorage from 'src/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import loadSafesFromStorage from 'src/logic/safe/store/actions/loadSafesFromStorage'
import { store } from 'src/store'
import { SENTRY_DSN } from './utils/constants'
import { disableMMAutoRefreshWarning } from './utils/mm_warnings'
import { switchNetworkWithUrl } from './utils/history'

// Set the initial network id from the URL
if (typeof window !== 'undefined') {
  switchNetworkWithUrl({ pathname: window.location.pathname })
}

disableMMAutoRefreshWarning()

BigNumber.set({ EXPONENTIAL_AT: [-7, 255] })

store.dispatch(loadSafesFromStorage())
store.dispatch(loadCurrentSessionFromStorage())

Sentry.init({
  dsn: SENTRY_DSN,
  release: `safe-react@${process.env.REACT_APP_APP_VERSION}`,
  integrations: [new Integrations.BrowserTracing()],
  sampleRate: 0.1,
  // ignore MetaMask errors we don't control
  ignoreErrors: ['Internal JSON-RPC error', 'JsonRpcEngine', 'Non-Error promise rejection captured with keys: code'],
})

const root = document.getElementById('root')

if (root !== null) {
  ReactDOM.render(<Root />, root)
}
