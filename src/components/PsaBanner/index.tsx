import { ReactElement, useEffect } from 'react'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSelector } from 'react-redux'
import Close from '@material-ui/icons/Close'
import { currentChainId } from 'src/logic/config/store/selectors'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import useCachedState from 'src/utils/storage/useCachedState'
import styles from './index.module.scss'

const BANNERS = {
  '4': <>🚨 Rinkeby will be deprecated by the end of October 2022. Please migrate to Görli. 🚨</>,

  '1313161554': (
    <>
      🚨 On <b>17.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Aurora, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours.{' '}
      <a
        target="_blank"
        href="https://forum.gnosis-safe.io/t/transaction-service-migration-october-2022/1550"
        rel="noreferrer"
      >
        More information
      </a>{' '}
      🚨
    </>
  ),
  '42161': (
    <>
      🚨 On <b>17.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Arbitrum, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours.{' '}
      <a
        target="_blank"
        href="https://forum.gnosis-safe.io/t/transaction-service-migration-october-2022/1550"
        rel="noreferrer"
      >
        More information
      </a>{' '}
      🚨
    </>
  ),
  '43114': (
    <>
      🚨 On <b>17.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Avalanche, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours.{' '}
      <a
        target="_blank"
        href="https://forum.gnosis-safe.io/t/transaction-service-migration-october-2022/1550"
        rel="noreferrer"
      >
        More information
      </a>{' '}
      🚨
    </>
  ),
  '10': (
    <>
      🚨 On <b>17.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Optimism, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours.{' '}
      <a
        target="_blank"
        href="https://forum.gnosis-safe.io/t/transaction-service-migration-october-2022/1550"
        rel="noreferrer"
      >
        More information
      </a>{' '}
      🚨
    </>
  ),
  '137': (
    <>
      🚨 On <b>18.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Polygon, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours.{' '}
      <a
        target="_blank"
        href="https://forum.gnosis-safe.io/t/transaction-service-migration-october-2022/1550"
        rel="noreferrer"
      >
        More information
      </a>{' '}
      🚨
    </>
  ),
  '56': (
    <>
      🚨 On <b>18.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on BNB Smart Chain, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours.{' '}
      <a
        target="_blank"
        href="https://forum.gnosis-safe.io/t/transaction-service-migration-october-2022/1550"
        rel="noreferrer"
      >
        More information
      </a>{' '}
      🚨
    </>
  ),
  '100': (
    <>
      🚨 On <b>20.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Gnosis Chain, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours.{' '}
      <a
        target="_blank"
        href="https://forum.gnosis-safe.io/t/transaction-service-migration-october-2022/1550"
        rel="noreferrer"
      >
        More information
      </a>{' '}
      🚨
    </>
  ),
  '1': (
    <>
      🚨 On <b>24.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Ethereum mainnet, during which
      the functionality of this application might be restricted. Please expect downtime of 2-3 hours.{' '}
      <a
        target="_blank"
        href="https://forum.gnosis-safe.io/t/transaction-service-migration-october-2022/1550"
        rel="noreferrer"
      >
        More information
      </a>{' '}
      🚨
    </>
  ),
}

const WARNING_BANNER = 'WARNING_BANNER'

const PsaBanner = (): ReactElement | null => {
  const chainId = useSelector(currentChainId)
  const banner = BANNERS[chainId]
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
