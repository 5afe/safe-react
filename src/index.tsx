import { BigNumber } from 'bignumber.js'
import * as ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
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
  // ignore MetaMask errors we don't control
  ignoreErrors: ['Internal JSON-RPC error', 'JsonRpcEngine', 'Non-Error promise rejection captured with keys: code'],
})

const container = document.getElementById('root') || document.body.appendChild(document.createElement('div'))

const root = ReactDOM.createRoot(container)

root.render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
