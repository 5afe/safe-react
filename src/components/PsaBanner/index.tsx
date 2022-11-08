import { ReactElement, useEffect } from 'react'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSelector } from 'react-redux'
import Close from '@material-ui/icons/Close'
import { currentChainId } from 'src/logic/config/store/selectors'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import useCachedState from 'src/utils/storage/useCachedState'
import styles from './index.module.scss'
import Countdown from './Countdown'
import { useLocation } from 'react-router-dom'

const NEW_URL = 'https://app.safe.global'

const redirectToNewApp = (): void => {
  const path = window.location.pathname.replace(/^\/app/, '')
  window.location.replace(NEW_URL + path)
}

const WARNING_BANNER = 'WARNING_BANNER'
const NO_REDIRECT_PARAM = 'no-redirect'

const WebCoreBanner = (): ReactElement | null => {
  const { search } = useLocation()
  const [shouldRedirect = true, setShouldRedirect] = useCachedState<boolean>(`${WARNING_BANNER}_shouldRedirect`, true)

  useEffect(() => {
    // Prevent refresh from overwriting the cached value
    const noRedirect = new URLSearchParams(search).get(NO_REDIRECT_PARAM)
    if (noRedirect) {
      setShouldRedirect(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      ⚠️ Safe&apos;s new official URL is <a href={NEW_URL}>app.safe.global</a>.<br />
      Please update your bookmarks.{' '}
      {shouldRedirect && (
        <Countdown seconds={10} onEnd={redirectToNewApp}>
          {(count) => <>Redirecting in {count} seconds...</>}
        </Countdown>
      )}
    </>
  )
}

const BANNERS: Record<string, ReactElement | string> = {
  '*': <WebCoreBanner />,
}

const PsaBanner = (): ReactElement | null => {
  const chainId = useSelector(currentChainId)
  const banner = BANNERS[chainId] || BANNERS['*']
  const isEnabled = hasFeature(WARNING_BANNER as FEATURES)
  const [closed = false, setClosed] = useCachedState<boolean>(
    BANNERS[chainId] ? `${WARNING_BANNER}_${chainId}_closed` : `${WARNING_BANNER}_closed`,
    true,
  )

  const showBanner = Boolean(isEnabled && banner && !closed)

  const onClose = () => {
    setClosed(true)
  }

  useEffect(() => {
    document.body.setAttribute('data-with-banner', showBanner.toString())
  }, [showBanner])

  return showBanner ? (
    <div className={styles.banner}>
      <div className={styles.wrapper}>
        <div className={styles.content}>{banner}</div>

        <Close className={styles.close} onClick={onClose} />
      </div>
    </div>
  ) : null
}

export default PsaBanner
