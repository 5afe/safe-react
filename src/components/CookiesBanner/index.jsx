// @flow
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import Link from '~/components/layout/Link'
import Button from '~/components/layout/Button'
import { primary, mainFontFamily, md, screenSm } from '~/theme/variables'
import type { CookiesProps } from '~/logic/cookies/model/cookie'
import { COOKIES_KEY } from '~/logic/cookies/model/cookie'
import { loadFromCookie, saveCookie } from '~/logic/cookies/utils'
import { cookieBannerOpen } from '~/logic/cookies/store/selectors'
import { openCookieBanner } from '~/logic/cookies/store/actions/openCookieBanner'
import { loadIntercom } from '~/utils/intercom'
import { loadGoogleAnalytics } from '~/utils/googleAnalytics'

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
})

const CookiesBanner = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [showAnalytics, setShowAnalytics] = useState(false)
  const [localNecessary, setLocalNecessary] = useState(true)
  const [localAnalytics, setLocalAnalytics] = useState(false)
  const showBanner = useSelector(cookieBannerOpen)

  useEffect(() => {
    async function fetchCookiesFromStorage() {
      const cookiesState: ?CookiesProps = await loadFromCookie(COOKIES_KEY)
      if (cookiesState) {
        const { acceptedNecessary, acceptedAnalytics } = cookiesState
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
  }, [showBanner])

  const acceptCookiesHandler = async () => {
    const newState = {
      acceptedNecessary: true,
      acceptedAnalytics: true,
    }
    await saveCookie(COOKIES_KEY, newState, 365)
    dispatch(openCookieBanner(false))
    setShowAnalytics(true)
  }

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
        role="button"
        tabIndex="0"
        onClick={closeCookiesBannerHandler}
        onKeyDown={closeCookiesBannerHandler}
        className={cn(classes.acceptPreferences, classes.text)}
      >
        Accept preferences &gt;
      </span>
      <div className={classes.content}>
        <p className={classes.text}>
          We use cookies to give you the best experience and to help improve our
          website. Please read our{' '}
          <Link className={classes.link} to="https://safe.gnosis.io/cookie">
            Cookie Policy
          </Link>{' '}
          for more information. By clicking &quot;Accept all&quot;, you agree to
          the storing of cookies on your device to enhance site navigation,
          analyze site usage and provide customer support.
        </p>
        <div className={classes.form}>
          <div className={classes.formItem}>
            <FormControlLabel
              checked={localNecessary}
              disabled
              label="Necessary"
              name="Necessary"
              onChange={() => setLocalNecessary(prev => !prev)}
              value={localNecessary}
              control={<Checkbox disabled />}
            />
          </div>
          <div className={classes.formItem}>
            <FormControlLabel
              label="Analytics"
              name="Analytics"
              onChange={() => setLocalAnalytics(prev => !prev)}
              value={localAnalytics}
              control={<Checkbox checked={localAnalytics} />}
            />
          </div>
          <div className={classes.formItem}>
            <Button
              color="primary"
              component={Link}
              minWidth={180}
              variant="outlined"
              onClick={() => acceptCookiesHandler()}
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

  return showBanner ? cookieBannerContent : null
}

export default CookiesBanner
