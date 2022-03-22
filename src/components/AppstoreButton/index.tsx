import { ReactElement } from 'react'
import AppstoreDarkBadge from 'src/assets/icons/appstore.svg'
import AppstoreLightBadge from 'src/assets/icons/appstore-alt.svg'

enum LINKS {
  footer = 'https://apps.apple.com/app/apple-store/id1515759131?pt=119497694&ct=Web%20App%20Footer&mt=8',
  pairing = 'https://apps.apple.com/app/apple-store/id1515759131?pt=119497694&ct=Web%20App%20Connect&mt=8',
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
          height: '35px',
        }}
      />
    </a>
  )
}

export default AppstoreButton
