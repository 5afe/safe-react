import { BigNumber } from 'bignumber.js'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import Root from 'src/components/Root'
import { SENTRY_DSN } from './utils/constants'
import { disableMMAutoRefreshWarning } from './utils/mm_warnings'

disableMMAutoRefreshWarning()

BigNumber.set({ EXPONENTIAL_AT: [-7, 255] })

Sentry.init({
  dsn: SENTRY_DSN,
  release: `safe-react@${process.env.REACT_APP_APP_VERSION}`,
  integrations: [new Integrations.BrowserTracing()],
  sampleRate: 0.1,
  ignoreErrors: [
    // MetaMask errors we don't control
    'Internal JSON-RPC error',
    'JsonRpcEngine',
    'Non-Error promise rejection captured with keys: code',
    // Duplicate of Errors._800 emitted by promiEvent
    'Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!',
    // Insignificant ResizeObserver errors
    'ResizeObserver loop completed with undelivered notifications.',
    'ResizeObserver loop limit exceeded',
  ],
})

const root = document.getElementById('root')

if (root !== null) {
  ReactDOM.render(<Root />, root)
}
