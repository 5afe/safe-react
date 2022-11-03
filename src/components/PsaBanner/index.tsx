import { ReactElement, useEffect } from 'react'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSelector } from 'react-redux'
import Close from '@material-ui/icons/Close'
import { currentChainId } from 'src/logic/config/store/selectors'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import useCachedState from 'src/utils/storage/useCachedState'
import styles from './index.module.scss'
import Countdown from './Countdown'

const NEW_URL = 'https://app.safe.global'

const redirectToNewApp = (): void => {
  const path = window.location.pathname.replace(/^\/app/, '')
  window.location.replace(NEW_URL + path)
}

const BANNERS: Record<string, ReactElement | string> = {
  '*': (
    <>
      ⚠️ Safe&apos;s new official URL is <a href={NEW_URL}>app.safe.global</a>.<br />
      Please update your bookmarks.{' '}
      <Countdown seconds={10} onEnd={redirectToNewApp}>
        {(count) => <>Redirecting in {count} seconds...</>}
      </Countdown>
    </>
  ),
}

const WARNING_BANNER = 'WARNING_BANNER'

const PsaBanner = (): ReactElement | null => {
  const chainId = useSelector(currentChainId)
  const banner = BANNERS[chainId] || BANNERS['*']
  const isEnabled = hasFeature(WARNING_BANNER as FEATURES)
  const [closed = false, setClosed] = useCachedState<boolean>(`${WARNING_BANNER}_${chainId}_closed`, true)

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
