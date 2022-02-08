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
        Third party cookies disabled. Safe apps may not work properly under this circumstances. You can find the
        information about this problem in{' '}
        <Link href={HELP_LINK} size="xl" target="_blank">
          Help Article
        </Link>
      </MuiAlertTitle>
    </MuiAlert>
  )
}
