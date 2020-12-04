import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from 'src/components/layout/Button'
import Link from 'src/components/layout/Link'
import { COOKIES_KEY } from 'src/logic/cookies/model/cookie'
import { openCookieBanner } from 'src/logic/cookies/store/actions/openCookieBanner'
import { cookieBannerOpen } from 'src/logic/cookies/store/selectors'
import { loadFromCookie, saveCookie } from 'src/logic/cookies/utils'
import { mainFontFamily, md, primary, screenSm } from 'src/theme/variables'

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
    display: 'flex',
    gridTemplateColumns: '1fr',
    paddingBottom: '30px',
    rowGap: '10px',
    alignItems: 'center',
    justifyContent: 'center',

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
} as any)

const CookiesBanner = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const showBanner = useSelector(cookieBannerOpen)

  const acceptCookiesHandler = useCallback(async () => {
    const newState = {
      acceptedNecessary: true,
    }
    await saveCookie(COOKIES_KEY, newState, 365)
    dispatch(openCookieBanner(false))
  }, [dispatch])

  useEffect(() => {
    async function fetchCookiesFromStorage() {
      const cookiesState = await loadFromCookie(COOKIES_KEY)
      if (cookiesState) {
        const { acceptedNecessary } = cookiesState
        const openBanner = acceptedNecessary === false || showBanner
        dispatch(openCookieBanner(openBanner))
      } else {
        dispatch(openCookieBanner(true))
      }
    }
    fetchCookiesFromStorage()
  }, [dispatch, showBanner])

  useEffect(() => {
    if (isDesktop && showBanner) acceptCookiesHandler()
  }, [acceptCookiesHandler, showBanner])

  const cookieBannerContent = (
    <div className={classes.container}>
      <div className={classes.content}>
        <p className={classes.text}>
          We use cookies to give you the best experience and to help improve our website. Please read our{' '}
          <Link className={classes.link} to="https://safe.gnosis.io/cookie">
            Cookie Policy
          </Link>{' '}
          for more information. By clicking &quot;Accept&quot;, you agree to the storing of cookies on your device to
          enhance site navigation.
        </p>
        <div className={classes.form}>
          <div className={classes.formItem}>
            <Button
              color="primary"
              component={Link}
              minWidth={180}
              onClick={() => acceptCookiesHandler()}
              variant="outlined"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return showBanner && !isDesktop ? cookieBannerContent : null
}

export default CookiesBanner
