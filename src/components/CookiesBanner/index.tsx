import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles } from '@material-ui/core/styles'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from 'src/components/layout/Button'
import Link from 'src/components/layout/Link'
import { COOKIES_KEY } from 'src/logic/cookies/model/cookie'
import { openCookieBanner } from 'src/logic/cookies/store/actions/openCookieBanner'
import { cookieBannerOpen } from 'src/logic/cookies/store/selectors'
import { loadFromCookie, saveCookie } from 'src/logic/cookies/utils'
import { mainFontFamily, md, primary, screenSm } from 'src/theme/variables'
import { loadGoogleAnalytics, removeCookies } from 'src/utils/googleAnalytics'
import { closeIntercom, isIntercomLoaded, loadIntercom } from 'src/utils/intercom'
import AlertRedIcon from './assets/alert-red.svg'
import IntercomIcon from './assets/intercom.png'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { CookieAttributes } from 'js-cookie'

const isDesktop = process.env.REACT_APP_BUILD_FOR_DESKTOP

const useStyles = makeStyles({
  container: {
    backgroundColor: '#fff',
    bottom: '0',
    boxShadow: '1px 2px 10px 0 rgba(40, 54, 61, 0.18)',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    left: '0',
    minHeight: '200px',
    padding: '30px 15px 45px',
    position: 'fixed',
    width: '100%',
    zIndex: '999',
  },
  content: {
    maxWidth: '100%',
  },
  text: {
    color: primary,
    fontFamily: mainFontFamily,
    fontSize: md,
    fontWeight: 'normal',
    lineHeight: '1.38',
    margin: '0 auto 35px',
    textAlign: 'center',
    maxWidth: '810px',
  },
  form: {
    columnGap: '20px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    paddingBottom: '50px',
    rowGap: '15px',
    margin: '0 auto',
    [`@media (min-width: ${screenSm}px)`]: {
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
      paddingBottom: '0',
      rowGap: '5px',
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
  intercomAlert: {
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 0 13px 0',
    svg: {
      marginRight: '5px',
    },
  },
  intercomImage: {
    display: 'none',
    position: 'fixed',
    cursor: 'pointer',
    height: '80px',
    width: '80px',
    bottom: '8px',
    right: '10px',
    zIndex: '1000',
    boxShadow: '1px 2px 10px 0 var(rgba(40, 54, 61, 0.18))',
  },
} as any)

interface CookiesBannerFormProps {
  alertMessage: boolean
}

const CookiesBanner = (): ReactElement => {
  const classes = useStyles()
  const dispatch = useRef(useDispatch())
  const intercomLoaded = isIntercomLoaded()

  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showIntercom, setShowIntercom] = useState(false)
  const [localNecessary, setLocalNecessary] = useState(true)
  const [localAnalytics, setLocalAnalytics] = useState(false)
  const [localIntercom, setLocalIntercom] = useState(false)
  const { getAppUrl } = useSafeAppUrl()

  const showBanner = useSelector(cookieBannerOpen)
  const newAppUrl = getAppUrl()
  const isSafeAppView = newAppUrl !== null

  useEffect(() => {
    if (showIntercom && !isSafeAppView) {
      loadIntercom()
    }
  }, [showIntercom, isSafeAppView])

  useEffect(() => {
    if (intercomLoaded && isSafeAppView) {
      closeIntercom()
    }
  }, [isSafeAppView, intercomLoaded])

  useEffect(() => {
    async function fetchCookiesFromStorage() {
      const cookiesState = await loadFromCookie(COOKIES_KEY)
      if (!cookiesState) {
        dispatch.current(openCookieBanner({ cookieBannerOpen: true }))
      } else {
        const { acceptedIntercom, acceptedAnalytics, acceptedNecessary } = cookiesState
        if (acceptedIntercom === undefined) {
          const newState = {
            acceptedNecessary,
            acceptedAnalytics,
            acceptedIntercom: acceptedAnalytics,
          }
          const cookieConfig: CookieAttributes = {
            expires: acceptedAnalytics ? 365 : 7,
          }
          await saveCookie(COOKIES_KEY, newState, cookieConfig)
          setLocalIntercom(newState.acceptedIntercom)
          setShowIntercom(newState.acceptedIntercom)
        } else {
          setLocalIntercom(acceptedIntercom)
          setShowIntercom(acceptedIntercom)
        }
        setLocalAnalytics(acceptedAnalytics)
        setLocalNecessary(acceptedNecessary)

        if (acceptedAnalytics && !isDesktop) {
          loadGoogleAnalytics()
        }
      }
    }
    fetchCookiesFromStorage()
  }, [showAnalytics, showIntercom])

  const acceptCookiesHandler = async () => {
    const newState = {
      acceptedNecessary: true,
      acceptedAnalytics: !isDesktop,
      acceptedIntercom: true,
    }
    const cookieConfig: CookieAttributes = {
      expires: 365,
    }
    await saveCookie(COOKIES_KEY, newState, cookieConfig)
    setShowAnalytics(!isDesktop)
    setShowIntercom(true)
    dispatch.current(openCookieBanner({ cookieBannerOpen: false }))
  }

  const closeCookiesBannerHandler = async () => {
    const newState = {
      acceptedNecessary: true,
      acceptedAnalytics: localAnalytics,
      acceptedIntercom: localIntercom,
    }
    const cookieConfig: CookieAttributes = {
      expires: localAnalytics ? 365 : 7,
    }
    await saveCookie(COOKIES_KEY, newState, cookieConfig)
    setShowAnalytics(localAnalytics)
    setShowIntercom(localIntercom)

    if (!localAnalytics) {
      removeCookies()
    }

    if (!localIntercom && isIntercomLoaded()) {
      closeIntercom()
    }
    dispatch.current(openCookieBanner({ cookieBannerOpen: false }))
  }

  const CookiesBannerForm = (props: CookiesBannerFormProps) => {
    const { alertMessage } = props
    return (
      <div data-testid="cookies-banner-form" className={classes.container}>
        <div className={classes.content}>
          {alertMessage && (
            <div className={classes.intercomAlert}>
              <img src={AlertRedIcon} />
              You attempted to open the customer support chat. Please accept the customer support cookie.
            </div>
          )}
          <p className={classes.text}>
            We use cookies to provide you with the best experience and to help improve our website and application.
            Please read our{' '}
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
            {/* <div className={classes.formItem}>
              <FormControlLabel
                control={<Checkbox checked={localIntercom} />}
                label="Customer support"
                name="Customer support"
                onChange={() => setLocalIntercom((prev) => !prev)}
                value={localIntercom}
              />
            </div> */}
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
                onClick={() => closeCookiesBannerHandler()}
                variant="outlined"
              >
                Accept selection
              </Button>
            </div>
            <div className={classes.formItem}>
              <Button
                color="primary"
                component={Link}
                minWidth={180}
                onClick={() => acceptCookiesHandler()}
                variant="contained"
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {!isDesktop && !showIntercom && !isSafeAppView && (
        <img
          className={classes.intercomImage}
          src={IntercomIcon}
          onClick={() => dispatch.current(openCookieBanner({ cookieBannerOpen: true, intercomAlertDisplayed: true }))}
        />
      )}
      {!isDesktop && showBanner?.cookieBannerOpen && (
        <CookiesBannerForm alertMessage={showBanner?.intercomAlertDisplayed} />
      )}
    </>
  )
}

export default CookiesBanner
