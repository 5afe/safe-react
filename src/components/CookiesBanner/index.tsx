import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from 'src/components/layout/Button'
import Link from 'src/components/layout/Link'
import { COOKIES_KEY } from 'src/logic/cookies/model/cookie'
import { openCookieBanner } from 'src/logic/cookies/store/actions/openCookieBanner'
import { cookieBannerOpen } from 'src/logic/cookies/store/selectors'
import { loadFromCookie, saveCookie } from 'src/logic/cookies/utils'
import { mainFontFamily, md, primary, screenSm } from 'src/theme/variables'
import { loadGoogleAnalytics } from 'src/utils/googleAnalytics'
import { loadIntercom } from 'src/utils/intercom'

const isDesktop = process.env.REACT_APP_BUILD_FOR_DESKTOP

const useStyles = makeStyles({
  container: {
    backgroundColor: '#fff',
    bottom: '0',
    boxShadow: '0 2px 4px 0 rgba(212, 212, 211, 0.59)',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    left: '0',
    minHeight: '200px',
    padding: '27px 15px',
    position: 'fixed',
    width: '100%',
    zIndex: '15',
  },
  content: {
    maxWidth: '100%',
    width: '830px',
  },
  text: {
    color: primary,
    fontFamily: mainFontFamily,
    fontSize: md,
    fontWeight: 'normal',
    lineHeight: '1.38',
    margin: '0 0 25px',
    textAlign: 'center',
  },
  form: {
    columnGap: '10px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    paddingBottom: '30px',
    rowGap: '10px',

    [`@media (min-width: ${screenSm}px)`]: {
      gridTemplateColumns: '1fr 1fr 1fr',
      paddingBottom: '0',
    },
  },
  formItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  acceptPreferences: {
    bottom: '-20px',
    cursor: 'pointer',
    position: 'absolute',
    right: '20px',
    textDecoration: 'underline',

    [`@media (min-width: ${screenSm}px)`]: {
      bottom: '-10px',
    },

    '&:hover': {
      textDecoration: 'none',
    },
  },
} as any)

const CookiesBanner = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [showAnalytics, setShowAnalytics] = useState(false)
  const [localNecessary, setLocalNecessary] = useState(true)
  const [localAnalytics, setLocalAnalytics] = useState(false)
  const showBanner = useSelector(cookieBannerOpen)

  const acceptCookiesHandler = useCallback(async () => {
    const newState = {
      acceptedNecessary: true,
      acceptedAnalytics: !isDesktop,
    }
    await saveCookie(COOKIES_KEY, newState, 365)
    dispatch(openCookieBanner(false))
    setShowAnalytics(!isDesktop)
  }, [dispatch])

  useEffect(() => {
    async function fetchCookiesFromStorage() {
      const cookiesState = await loadFromCookie(COOKIES_KEY)
      if (cookiesState) {
        const { acceptedAnalytics, acceptedNecessary } = cookiesState
        setLocalAnalytics(acceptedAnalytics)
        setLocalNecessary(acceptedNecessary)
        const openBanner = acceptedNecessary === false || showBanner
        dispatch(openCookieBanner(openBanner))
        setShowAnalytics(acceptedAnalytics)
      } else {
        dispatch(openCookieBanner(true))
      }
    }
    fetchCookiesFromStorage()
  }, [dispatch, showBanner])

  useEffect(() => {
    if (isDesktop && showBanner) acceptCookiesHandler()
  }, [acceptCookiesHandler, showBanner])

  const closeCookiesBannerHandler = async () => {
    const newState = {
      acceptedNecessary: true,
      acceptedAnalytics: localAnalytics,
    }
    const expDays = localAnalytics ? 365 : 7
    await saveCookie(COOKIES_KEY, newState, expDays)
    setShowAnalytics(localAnalytics)
    dispatch(openCookieBanner(false))
  }

  const cookieBannerContent = (
    <div className={classes.container}>
      <span
        className={cn(classes.acceptPreferences, classes.text)}
        onClick={closeCookiesBannerHandler}
        onKeyDown={closeCookiesBannerHandler}
        role="button"
        tabIndex={0}
        data-testid="accept-preferences"
      >
        Accept preferences &gt;
      </span>
      <div className={classes.content}>
        <p className={classes.text}>
          We use cookies to give you the best experience and to help improve our website. Please read our{' '}
          <Link className={classes.link} to="https://gnosis-safe.io/cookie">
            Cookie Policy
          </Link>{' '}
          for more information. By clicking &quot;Accept all&quot;, you agree to the storing of cookies on your device
          to enhance site navigation, analyze site usage and provide customer support.
        </p>
        <div className={classes.form}>
          <div className={classes.formItem}>
            <FormControlLabel
              checked={localNecessary}
              control={<Checkbox disabled />}
              disabled
              label="Necessary"
              name="Necessary"
              onChange={() => setLocalNecessary((prev) => !prev)}
              value={localNecessary}
            />
          </div>
          <div className={classes.formItem}>
            <FormControlLabel
              control={<Checkbox checked={localAnalytics} />}
              label="Analytics"
              name="Analytics"
              onChange={() => setLocalAnalytics((prev) => !prev)}
              value={localAnalytics}
            />
          </div>
          <div className={classes.formItem}>
            <Button
              color="primary"
              component={Link}
              minWidth={180}
              onClick={() => acceptCookiesHandler()}
              variant="outlined"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (showAnalytics) {
    loadIntercom()
    loadGoogleAnalytics()
  }
  if (isDesktop) loadIntercom()

  return showBanner && !isDesktop ? cookieBannerContent : null
}

export default CookiesBanner
