import { ReactElement, useEffect } from 'react'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSelector } from 'react-redux'
import Close from '@material-ui/icons/Close'
import { currentChainId } from 'src/logic/config/store/selectors'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import useCachedState from 'src/utils/storage/useCachedState'
import styles from './index.module.scss'

const NEW_URL = 'https://app.safe.global'
const WARNING_BANNER = 'WARNING_BANNER'
const EXPORT_HELP = 'https://help.gnosis-safe.io/en/articles/5299068-address-book-export-and-import'

const WebCoreBanner = (): ReactElement | null => {
  return (
    <>
      ⚠️ Safe&apos;s new official URL is <a href={NEW_URL}>app.safe.global</a>.<br />
      We recommend{' '}
      <a href={EXPORT_HELP} target="_blank" rel="noreferrer">
        exporting your address book
      </a>{' '}
      as CSV and importing it in the new app.
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
