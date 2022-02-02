import React from 'react'
import MuiAlert from '@material-ui/lab/Alert'
import MuiAlertTitle from '@material-ui/lab/AlertTitle'
import { Link } from '@gnosis.pm/safe-react-components'

type Props = {
  onEdit: () => void
  onClose: () => void
}

export const ThirdPartyCookiesWarning = ({ onEdit, onClose }: Props): React.ReactElement => {
  return (
    <MuiAlert severity="warning" onClose={onClose}>
      <MuiAlertTitle>
        Third party cookies disabled. Safe apps may not work properly under this circumstances.{' '}
        <Link href="#" size="xl" onClick={onEdit}>
          Edit Cookies
        </Link>{' '}
        to improve your experience.
      </MuiAlertTitle>
    </MuiAlert>
  )
}
