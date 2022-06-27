import { ReactElement } from 'react'
import AppstoreDarkBadge from 'src/assets/icons/appstore.svg'
import AppstoreLightBadge from 'src/assets/icons/appstore-alt.svg'
import MOBILE_APP_EVENTS from 'src/utils/events/mobile-app-promotion'
import { trackEvent } from 'src/utils/googleTagManager'

// App Store campaigns track the user interaction
enum LINKS {
  footer = 'https://apps.apple.com/app/apple-store/id1515759131?pt=119497694&ct=Web%20App%20Footer&mt=8',
  pairing = 'https://apps.apple.com/app/apple-store/id1515759131?pt=119497694&ct=Web%20App%20Connect&mt=8',
  dashboard = 'https://apps.apple.com/app/apple-store/id1515759131?pt=119497694&ct=Web%20App%20Dashboard&mt=8',
}

type AppstoreButtonProps = {
  light?: boolean
  placement: 'footer' | 'pairing' | 'dashboard'
}

const AppstoreButton = (props: AppstoreButtonProps): ReactElement => {
  const onClick = () => {
    trackEvent({
      ...MOBILE_APP_EVENTS.appstoreButtonClick,
      label: props.placement,
    })
  }

  return (
    <a href={LINKS[props.placement]} target="_blank" rel="noreferrer" onClick={onClick}>
      <img
        src={props.light ? AppstoreLightBadge : AppstoreDarkBadge}
        alt="Download on the App Store"
        style={{
          display: 'block',
          height: '35px',
        }}
      />
    </a>
  )
}

export default AppstoreButton
