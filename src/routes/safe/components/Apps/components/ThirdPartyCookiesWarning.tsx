import React from 'react'
import MuiAlert from '@material-ui/lab/Alert'
import MuiAlertTitle from '@material-ui/lab/AlertTitle'
import { Link } from '@gnosis.pm/safe-react-components'

type Props = {
  onClose: () => void
}

const HELP_LINK =
  'https://help.gnosis-safe.io/en/articles/5955031-why-do-i-need-to-enable-third-party-cookies-for-safe-apps'

export const ThirdPartyCookiesWarning = ({ onClose }: Props): React.ReactElement => {
  return (
    <MuiAlert severity="warning" onClose={onClose}>
      <MuiAlertTitle>
        Third party cookies are disabled. Safe Apps may therefore not work properly. You can find out more information
        about this{' '}
        <Link href={HELP_LINK} size="xl" target="_blank">
          here
        </Link>
      </MuiAlertTitle>
    </MuiAlert>
  )
}
