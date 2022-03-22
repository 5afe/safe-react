import { ReactElement } from 'react'
import AppstoreLightBadge from 'src/assets/icons/appstore-light.png'
import AppstoreDarkBadge from 'src/assets/icons/appstore-dark.svg'

enum LINKS {
  footer = 'https://apps.apple.com/app/apple-store/id1515759131?pt=119497694&ct=Web%20App%20Footer&mt=8',
  pairing = 'https://apps.apple.com/us/app/gnosis-safe/id1515759131',
}

type AppstoreButtonProps = {
  light?: boolean
  placement: 'footer' | 'pairing'
}

const AppstoreButton = (props: AppstoreButtonProps): ReactElement => {
  return (
    <a href={LINKS[props.placement]} target="_blank" rel="noreferrer">
      <img
        src={props.light ? AppstoreLightBadge : AppstoreDarkBadge}
        alt="Download on the App Store"
        style={{
          display: 'block',
          height: `${props.light ? 30 : 35}px`,
        }}
      />
    </a>
  )
}

export default AppstoreButton
