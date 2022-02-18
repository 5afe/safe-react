import type { AppProps } from 'next/app'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { BigNumber } from 'bignumber.js'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { PUBLIC_URL, SENTRY_DSN } from 'src/utils/constants'
import 'src/theme/variables.scss'
import 'src/components/Root/index.css'
import 'src/components/Root/OnboardCustom.css'

BigNumber.set({ EXPONENTIAL_AT: [-7, 255] })

Sentry.init({
  dsn: SENTRY_DSN,
  release: `safe-react@${process.env.REACT_APP_APP_VERSION}`,
  integrations: [new Integrations.BrowserTracing()],
  sampleRate: 0.1,
  // ignore MetaMask errors we don't control
  ignoreErrors: ['Internal JSON-RPC error', 'JsonRpcEngine', 'Non-Error promise rejection captured with keys: code'],
})

const Root = dynamic(
  () => {
    return import('src/components/Root')
  },
  {
    ssr: false,
    loading: () => <img className="safe-preloader-animation" src={`${PUBLIC_URL}/resources/safe.png`} />,
  },
)

function SafeReactApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Gnosis Safe</title>

        <link rel="shortcut icon" href="favicon.ico" />

        <base href={`${PUBLIC_URL}/`} />

        <meta property="og:title" content="Gnosis Safe" />
        <meta
          property="og:description"
          content="Gnosis Safe is the most trusted platform to manage digital assets on Ethereum"
        />
        <meta property="og:image" content={`${PUBLIC_URL}/resources/og-image.png`} />
        <meta name="twitter:card" content="summxay_large_image" />
        <meta name="twitter:image" content={`${PUBLIC_URL}/resources/og-image.png`} />
      </Head>

      <Root>
        <Component {...pageProps} />
      </Root>
    </>
  )
}

export default SafeReactApp
