import { ReactElement, useEffect, useRef } from 'react'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSelector } from 'react-redux'
import Close from '@material-ui/icons/Close'
import { currentChainId } from 'src/logic/config/store/selectors'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import useCachedState from 'src/utils/storage/useCachedState'

const BANNERS = {
  '4': <>🚨 Rinkeby is being deprecated. Please migrate to Goerli. 🚨</>,
  '5': (
    <>
      🚨 On <b>13.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Goerli, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '73799': (
    <>
      🚨 On <b>13.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Volta, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '246': (
    <>
      🚨 On <b>13.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Energy Web Chain, during which
      the functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '1313161554': (
    <>
      🚨 On <b>17.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Aurora, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '42161': (
    <>
      🚨 On <b>17.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Arbitrum, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '43114': (
    <>
      🚨 On <b>17.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Avalanche, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '10': (
    <>
      🚨 On <b>17.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Optimism, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '137': (
    <>
      🚨 On <b>18.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Polygon, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '56': (
    <>
      🚨 On <b>18.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on BNB Smart Chain, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '100': (
    <>
      🚨 On <b>20.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Gnosis Chain, during which the
      functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
  '1': (
    <>
      🚨 On <b>24.10.2022 @ 9am CEST</b> we will be undertaking indexer maintenance on Ethereum mainnet, during which
      the functionality of this application might be restricted. Please expect downtime of 2-3 hours. 🚨
    </>
  ),
}

const WARNING_BANNER = 'WARNING_BANNER'

const PsaBanner = (): ReactElement => {
  const bannerRef = useRef<HTMLDivElement>(null)
  const chainId = useSelector(currentChainId)
  const banner = BANNERS[chainId]
  const isEnabled = hasFeature(WARNING_BANNER as FEATURES)
  const [closed = false, setClosed] = useCachedState<boolean>(`${WARNING_BANNER}_${chainId}_closed`)

  const showBanner = isEnabled && banner && !closed

  const onClose = () => {
    setClosed(true)
  }

  useEffect(() => {
    document.body.style.paddingTop = bannerRef.current ? bannerRef.current.clientHeight + 'px' : ''
  }, [bannerRef])

  return (
    showBanner && (
      <div
        ref={bannerRef}
        style={{
          position: 'fixed',
          zIndex: 10000,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgb(0, 140, 115)',
          color: '#fff',
          padding: '5px 20px',
          fontSize: '16px',
          height: '80px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', padding: '10px' }}>{banner}</div>

          <Close
            style={{ display: 'none', position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', zIndex: 2 }}
            onClick={onClose}
          />
        </div>
      </div>
    )
  )
}

export default PsaBanner
