import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { makeStyles } from '@material-ui/core/styles'
import { Fragment, ReactElement, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from 'src/components/layout/Button'
import Link from 'src/components/layout/Link'
import { COOKIES_KEY, BannerCookiesType, COOKIE_IDS, COOKIE_ALERTS } from 'src/logic/cookies/model/cookie'
import { closeCookieBanner, openCookieBanner } from 'src/logic/cookies/store/actions/openCookieBanner'
import { cookieBannerState } from 'src/logic/cookies/store/selectors'
import { loadFromCookie, saveCookie } from 'src/logic/cookies/utils'
import { mainFontFamily, md, primary, screenSm } from 'src/theme/variables'
import { loadGoogleAnalytics, unloadGoogleAnalytics } from 'src/utils/googleAnalytics'
import { closeIntercom, isIntercomLoaded, loadIntercom } from 'src/utils/intercom'
import AlertRedIcon from './assets/alert-red.svg'
import IntercomIcon from './assets/intercom.png'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { loadBeamer, unloadBeamer } from 'src/utils/beamer'

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
} as any)

const CookiesBannerForm = (props: {
  onSubmit: (formNecessary: boolean, formSupportAndUpdates: boolean, formAnalytics: boolean) => void
  cookiesNecessary: boolean
  cookiesAnalytics: boolean
  cookiesSupportAndUpdates: boolean
}): ReactElement => {
  const [formNecessary, setFormNecessary] = useState(props.cookiesNecessary)
  const [formSupportAndUpdates, setFormSupportAndUpdates] = useState(props.cookiesSupportAndUpdates)
  const [formAnalytics, setFormAnalytics] = useState(props.cookiesAnalytics)
  const { key } = useSelector(cookieBannerState)
  const classes = useStyles()

  const onAccept = () => {
    props.onSubmit(formNecessary, formSupportAndUpdates, formAnalytics)
  }

  const onAcceptAll = () => {
    setFormNecessary(true)
    setFormSupportAndUpdates(true)
    setFormAnalytics(true)

    // A delay for visual feedback
    setTimeout(() => {
      props.onSubmit(true, true, true)
    }, 300)
  }

  return (
    <div data-testid="cookies-banner-form" className={classes.container}>
      <div className={classes.content}>
        {key && (
          <div className={classes.intercomAlert}>
            <img src={AlertRedIcon} alt="" />
            {COOKIE_ALERTS[key]}
          </div>
        )}
        <p className={classes.text}>
          We use cookies to provide you with the best experience and to help improve our website and application. Please
          read our{' '}
          <Link className={classes.link} to="https://gnosis-safe.io/cookie">
            Cookie Policy
          </Link>{' '}
          for more information. By clicking &quot;Accept all&quot;, you agree to the storing of cookies on your device
          to enhance site navigation, analyze site usage and provide customer support.
        </p>
        <div className={classes.form}>
          <div className={classes.formItem}>
            <FormControlLabel
              checked={formNecessary}
              control={<Checkbox disabled />}
              disabled
              label="Necessary"
              name="Necessary"
              onChange={() => setFormNecessary((prev) => !prev)}
              value={formNecessary}
            />
          </div>
          <div className={classes.formItem}>
            <FormControlLabel
              control={<Checkbox checked={formSupportAndUpdates} />}
              label="Community support & updates"
              name="Community support & updates"
              onChange={() => setFormSupportAndUpdates((prev) => !prev)}
              value={formSupportAndUpdates}
            />
          </div>
          <div className={classes.formItem}>
            <FormControlLabel
              control={<Checkbox checked={formAnalytics} />}
              label="Analytics"
              name="Analytics"
              onChange={() => setFormAnalytics((prev) => !prev)}
              value={formAnalytics}
            />
          </div>
          <div className={classes.formItem}>
            <Button color="primary" component={Link} minWidth={180} onClick={onAccept} variant="outlined">
              Accept selection
            </Button>
          </div>
          <div className={classes.formItem}>
            <Button color="primary" component={Link} minWidth={180} onClick={onAcceptAll} variant="contained">
              Accept all
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const FakeIntercomButton = ({ onClick }: { onClick: () => void }): ReactElement => {
  return (
    <img
      alt="Open Intercom"
      style={{
        position: 'fixed',
        cursor: 'pointer',
        height: '80px',
        width: '80px',
        bottom: '8px',
        right: '10px',
        zIndex: 1000,
        boxShadow: '1px 2px 10px 0 var(rgba(40, 54, 61, 0.18))',
      }}
      src={IntercomIcon}
      onClick={onClick}
    />
  )
}

const CookiesBanner = isDesktop
  ? Fragment
  : (): ReactElement => {
      const dispatch = useDispatch()

      const [localNecessary, setLocalNecessary] = useState(true)
      const [localSupportAndUpdates, setLocalSupportAndUpdates] = useState(false)
      const [localAnalytics, setLocalAnalytics] = useState(false)

      const { cookieBannerOpen } = useSelector(cookieBannerState)
      const isSafeAppView = useSafeAppUrl().getAppUrl() !== null

      const openBanner = useCallback(
        (key?: COOKIE_IDS): void => {
          dispatch(
            openCookieBanner({
              cookieBannerOpen: true,
              key,
            }),
          )
        },
        [dispatch],
      )

      const closeBanner = useCallback((): void => {
        dispatch(closeCookieBanner())
      }, [dispatch])

      const saveNewCookieState = (
        acceptedNecessary: boolean,
        acceptedSupportAndUpdates: boolean,
        acceptedAnalytics: boolean,
      ): void => {
        saveCookie<BannerCookiesType>(
          COOKIES_KEY,
          {
            acceptedNecessary,
            acceptedSupportAndUpdates,
            acceptedAnalytics,
          },
          {
            // Ask again in a week, if Analytics wasn't accepted
            expires: acceptedAnalytics ? 365 : 7,
          },
        )
      }

      const acceptCookiesHandler = (
        cookiesNecessary: boolean,
        cookiesSupportAndUpdates: boolean,
        cookiesAnalytics: boolean,
      ): void => {
        closeBanner()
        saveNewCookieState(cookiesNecessary, cookiesSupportAndUpdates, cookiesAnalytics)

        setLocalNecessary(cookiesNecessary)
        setLocalAnalytics(cookiesAnalytics)
        setLocalSupportAndUpdates(cookiesSupportAndUpdates)
      }

      // Init cookie banner's own cookie
      useEffect(() => {
        const cookiesState = loadFromCookie<BannerCookiesType>(COOKIES_KEY)

        // First visit to the app
        if (!cookiesState) {
          openBanner()
          return
        }

        const { acceptedNecessary, acceptedSupportAndUpdates, acceptedAnalytics } = cookiesState

        setLocalNecessary(acceptedNecessary)
        setLocalSupportAndUpdates(acceptedSupportAndUpdates)
        setLocalAnalytics(acceptedAnalytics)
      }, [setLocalNecessary, setLocalSupportAndUpdates, setLocalAnalytics, openBanner])

      // Load or unload analytics depending on user choice
      useEffect(() => {
        localAnalytics ? loadGoogleAnalytics() : unloadGoogleAnalytics()
      }, [localAnalytics])

      // Toggle Intercom
      useEffect(() => {
        if (isSafeAppView || !localSupportAndUpdates) {
          isIntercomLoaded() && closeIntercom()
          return
        }

        if (!isSafeAppView && localSupportAndUpdates) {
          !isIntercomLoaded() && loadIntercom()
        }
      }, [localSupportAndUpdates, isSafeAppView])

      // Toggle Beamer
      useEffect(() => {
        localSupportAndUpdates ? loadBeamer() : unloadBeamer()
      }, [localSupportAndUpdates])

      return (
        <>
          {/* A fake Intercom button before Intercom is loaded */}
          {!localSupportAndUpdates && !isSafeAppView && (
            <FakeIntercomButton onClick={() => openBanner(COOKIE_IDS.INTERCOM)} />
          )}

          {/* The cookie banner itself */}
          {cookieBannerOpen && (
            <CookiesBannerForm
              cookiesNecessary={localNecessary}
              cookiesSupportAndUpdates={localSupportAndUpdates}
              cookiesAnalytics={localAnalytics}
              onSubmit={acceptCookiesHandler}
            />
          )}
        </>
      )
    }

export default CookiesBanner
