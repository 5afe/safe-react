import React, { Suspense, lazy, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { GenericModal } from '@gnosis.pm/safe-react-components'

import { LOAD_ADDRESS, OPEN_ADDRESS, SAFELIST_ADDRESS, SAFE_PARAM_ADDRESS, WELCOME_ADDRESS } from './routes'

import Loader from 'src/components/Loader'
import { defaultSafeSelector } from 'src/logic/safe/store/selectors'
import { useAnalytics } from 'src/utils/googleAnalytics'
import { DEFAULT_SAFE_INITIAL_STATE } from 'src/logic/safe/store/reducer/safe'

const Welcome = lazy(() => import('./welcome/container'))

const Open = lazy(() => import('./open/container/Open'))

const Safe = lazy(() => import('./safe/container'))

const Load = lazy(() => import('./load/container/Load'))

const SAFE_ADDRESS = `${SAFELIST_ADDRESS}/:${SAFE_PARAM_ADDRESS}`

const Routes = (): React.ReactElement => {
  const [isInitialLoad, setInitialLoad] = useState(true)
  const location = useLocation()
  const matchSafeWithAction = useRouteMatch<{ safeAddress: string; safeAction: string }>({
    path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction`,
  })

  const defaultSafe = useSelector(defaultSafeSelector)
  const { trackPage } = useAnalytics()

  const [warningModal, setWarningModal] = useState({
    isOpen: true,
    title: <span style={{ fontWeight: 'bold' }}>{'Announcement'}</span>,
    body: (
      <div style={{ maxWidth: '500px' }}>
        <p>
          {`
          The current community version of Gnosis Safe homepage on Binance Smart Chain is expected to be retired around 2021/10/01
          at 1:00 PM (UTC). Gnosis Safe team has launched the mainnet support on Binance Smart Chain (BSC) here.
          We suggest all users migrate Safes from the community site to the `}
          <a href="https://bsc.gnosis-safe.io/" style={{ color: 'rgb(0, 140, 115)' }}>
            official site
          </a>
          {`. Because of the incompatible proxy implementation,
          we suggest users migrate manually by creating a new Safe via a new interface and then move all assets and authorities over.

          The successful TX may show as cancelled when the transaction volume on BSC is large, please always do double check!
        `}
        </p>
        <p>
          <b>{`Current balance is not synced. If you want to send any fund, please use a contract to interact with it.`}</b>
          <b>{`Do not add owner to your safe wallet, it can not be recognized.`}</b>
        </p>
      </div>
    ),
    footer: null,
    onClose: () => {},
  })

  useEffect(() => {
    if (isInitialLoad && location.pathname !== '/') {
      setInitialLoad(false)
    }
  }, [location.pathname, isInitialLoad])

  useEffect(() => {
    if (matchSafeWithAction) {
      // prevent logging safeAddress
      let safePage = `${SAFELIST_ADDRESS}/SAFE_ADDRESS`
      if (matchSafeWithAction.params?.safeAction) {
        safePage += `/${matchSafeWithAction.params?.safeAction}`
      }
      trackPage(safePage)
    } else {
      const page = `${location.pathname}${location.search}`
      trackPage(page)
    }
  }, [location, matchSafeWithAction, trackPage])

  const closeWarningModal = () => {
    if (warningModal.onClose) {
      warningModal.onClose?.()
    }

    setWarningModal({
      isOpen: false,
      title: <></>,
      body: <></>,
      footer: null,
      onClose: () => {},
    })
  }

  return (
    <Suspense fallback={null}>
      <Switch>
        <Route
          exact
          path="/"
          component={() => {
            if (!isInitialLoad) {
              return <Redirect to={WELCOME_ADDRESS} />
            }

            if (defaultSafe === DEFAULT_SAFE_INITIAL_STATE) {
              return <Loader />
            }

            if (defaultSafe) {
              return <Redirect to={`${SAFELIST_ADDRESS}/${defaultSafe}/balances`} />
            }

            return <Redirect to={WELCOME_ADDRESS} />
          }}
        />
        <Route component={Welcome} exact path={WELCOME_ADDRESS} />
        <Route component={Open} exact path={OPEN_ADDRESS} />
        <Route component={Safe} path={SAFE_ADDRESS} />
        <Route component={Load} exact path={LOAD_ADDRESS} />
        <Redirect to="/" />
      </Switch>
      {warningModal.isOpen && <GenericModal {...warningModal} onClose={closeWarningModal} />}
    </Suspense>
  )
}

export default Routes
