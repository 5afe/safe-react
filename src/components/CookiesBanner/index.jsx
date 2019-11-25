// @flow
import Checkbox from '@material-ui/core/Checkbox'
import Close from '@material-ui/icons/Close'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Link from '~/components/layout/Link'
import { WELCOME_ADDRESS } from '~/routes/routes'
import Button from '~/components/layout/Button'
import { primary, mainFontFamily } from '~/theme/variables'
import saveCookiesToStorage from '~/logic/cookies/store/actions/saveCookiesToStorage'
import type { CookiesProps } from '~/logic/cookies/store/model/cookie'
import { cookiesSelector } from '~/logic/cookies/store/selectors'

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
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: '1.38',
    margin: '0 0 25px',
    textAlign: 'center',
  },
  form: {
    columnGap: '10px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '10px',
    '@media (min-width: 960px)': {
      gridTemplateColumns: '1fr 1fr 1fr',
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
  close: {
    position: 'absolute',
    right: '12px',
    top: '12px',
  },
})


const CookiesBanner = () => {
  const classes = useStyles()
  const cookiesState: CookiesProps = useSelector(cookiesSelector)
  const dispatch = useDispatch()
  const { acceptedNecessary } = cookiesState
  const showBanner = acceptedNecessary === false
  const [localNecessary, setLocalNecessary] = useState(true)
  const [localAnalytics, setLocalAnalytics] = useState(false)

  const acceptCookiesHandler = (newState: CookiesProps) => {
    dispatch(saveCookiesToStorage(newState))
  }

  const closeCookiesBannerHandler = () => {
    const newState = {
      acceptedNecessary: true,
      acceptedAnalytics: false,
    }
    dispatch(saveCookiesToStorage(newState))
  }


  return showBanner ? (
    <div className={classes.container}>
      <IconButton onClick={() => closeCookiesBannerHandler()} className={classes.close}><Close /></IconButton>
      <div className={classes.content}>
        <p className={classes.text}>
We use cookies to give you the best
      experience and to help improve our website. Please read our
          {' '}
          <Link className={classes.link} to={WELCOME_ADDRESS}>Cookie Policy</Link>
          {' '}
      for more information. By clicking &quot;Accept cookies&quot;,
      you agree to the storing of cookies on your device to enhance site
      navigation and analyze site usage.
        </p>
        <div className={classes.form}>
          <div className={classes.formItem}>
            <FormControlLabel
              checked={localNecessary}
              disabled
              label="Necessary"
              name="Necessary"
              onChange={() => setLocalNecessary((prev) => !prev)}
              value={localNecessary}
              control={(
                <Checkbox />
              )}
            />
          </div>
          <div className={classes.formItem}>
            <FormControlLabel
              label="Analytics"
              name="Analytics"
              onChange={() => setLocalAnalytics((prev) => !prev)}
              value={localAnalytics}
              control={(
                <Checkbox />
              )}
            />
          </div>
          <div className={classes.formItem}>
            <Button
              color="primary"
              component={Link}
              disabled={!localNecessary}
              minWidth={180}
              variant="outlined"
              onClick={() => acceptCookiesHandler({
                acceptedNecessary: localNecessary,
                acceptedAnalytics: localAnalytics,
              })}
            >
              Accept Cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default CookiesBanner
