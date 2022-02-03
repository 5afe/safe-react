import React from 'react'
import MuiAlert from '@material-ui/lab/Alert'
import MuiAlertTitle from '@material-ui/lab/AlertTitle'
import { Link } from '@gnosis.pm/safe-react-components'

type Props = {
  onHelp: () => void
  onClose: () => void
}

export const ThirdPartyCookiesWarning = ({ onHelp, onClose }: Props): React.ReactElement => {
  return (
    <MuiAlert severity="warning" onClose={onClose}>
      <MuiAlertTitle>
        Third party cookies disabled. Safe apps may not work properly under this circumstances. You can find the
        information about this problem in{' '}
        <Link href="#" size="xl" onClick={onHelp}>
          Help Article
        </Link>
      </MuiAlertTitle>
    </MuiAlert>
  )
}
